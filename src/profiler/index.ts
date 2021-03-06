/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/restrict-plus-operands */

export const defaultProfileMemory: () => ProfilerMemory = () => ({
  data: {},
  total: 0,
  start: Game.time
});

let isProfilingEnabled = false;

export function init(): Profiler {
  Memory.profiler = defaultProfileMemory();

  const cli: Profiler = {
    isEnabled() {
      return isProfilingEnabled;
    },

    clear() {
      Memory.profiler = defaultProfileMemory();

      if (isProfilingEnabled) {
        Memory.profiler.start = Game.time;
      }

      return "Profiler Memory cleared";
    },

    output() {
      if (!isProfilingEnabled) {
        return;
      }

      outputProfilerData();

      return "Done";
    },

    status() {
      if (isProfilingEnabled) {
        return "Profiler is running";
      }

      return "Profiler is stopped";
    },

    start() {
      if (!Memory.profiler) {
        Memory.profiler = defaultProfileMemory();
      }

      isProfilingEnabled = true;
      Memory.profiler.start = Game.time;

      return "Profiler started";
    },

    stop() {
      if (isProfilingEnabled) {
        isProfilingEnabled = false;
        Memory.profiler = defaultProfileMemory();
      }

      return "Profiler stopped";
    },

    loop() {
      if (isProfilingEnabled) {
        outputProfilerData();
      } else {
        const data = Memory.profiler.data ?? {};

        if (_.size(data) > 0) {
          Memory.profiler.data = {};
        }
      }
    },

    help(): string {
      return (
        "Profiler.start() - Starts the profiler\n" +
        "Profiler.stop() - Stops/Pauses the profiler\n" +
        "Profiler.status() - Returns whether is profiler is currently running or not\n" +
        "Profiler.output() - Pretty-prints the collected profiler data to the console\n" +
        this.status()
      );
    }
  };

  return cli;
}

function wrapFunction(obj: object, key: any, className?: string) {
  const descriptor = Reflect.getOwnPropertyDescriptor(obj, key);
  if (!descriptor || descriptor.get || descriptor.set) {
    return;
  }

  if (key === "constructor") {
    return;
  }

  const originalFunction = descriptor.value;
  if (!originalFunction || typeof originalFunction !== "function") {
    return;
  }

  // set a key for the object in memory
  if (!className) {
    className = obj.constructor ? `${obj.constructor.name}` : "";
  }

  const memKey = className + `:${key}`;

  // set a tag so we don't wrap a function twice
  const savedName = `__${key}__`;
  if (Reflect.has(obj, savedName)) {
    return;
  }

  Reflect.set(obj, savedName, originalFunction);

  Reflect.set(obj, key, function (this: any, ...args: any[]) {
    if (isProfilingEnabled) {
      const start = Game.cpu.getUsed();
      const result = originalFunction.apply(this, args);
      const end = Game.cpu.getUsed();
      record(memKey, end - start);
      return result;
    }

    return originalFunction.apply(this, args);
  });
}

export function Profile(target: Function): void;
export function Profile(target: object, key: string): void;
export function Profile(target: object | Function, key?: string): void {
  if (!PROFILER_ENABLED) {
    return;
  }

  if (key) {
    // case of method decorator
    wrapFunction(target, key);
    return;
  }

  // case of class decorator

  const ctor = target as any;
  if (!ctor.prototype) {
    return;
  }

  const className = ctor.name;
  Reflect.ownKeys(ctor.prototype).forEach(k => {
    wrapFunction(ctor.prototype, k, className);
  });
}

function record(key: string, time: number) {
  if (!isProfilingEnabled) return;

  if (!Memory.profiler) {
    Memory.profiler = defaultProfileMemory();
  }

  if (!Memory.profiler.data[key]) {
    Memory.profiler.data[key] = {
      calls: 0,
      time: 0
    };
  }

  Memory.profiler.data[key].calls++;
  Memory.profiler.data[key].time += time;
}

interface OutputData {
  name: string;
  calls: number;
  cpuPerCall: number;
  callsPerTick: number;
  cpuPerTick: number;
}

function outputProfilerData() {
  if (!Memory.profiler) {
    Memory.profiler = defaultProfileMemory();
  }

  let totalTicks = Memory.profiler.total;

  if (Memory.profiler.start) {
    totalTicks += Game.time - Memory.profiler.start;
  }

  // /////
  // Process data
  let totalCpu = 0; // running count of average total CPU use per tick
  let calls: number;
  let time: number;
  let result: Partial<OutputData>;

  if (!Memory.profiler) {
    Memory.profiler = defaultProfileMemory();
  }

  const data = Reflect.ownKeys(Memory.profiler.data).map(key => {
    calls = Memory.profiler.data[key as string].calls;
    time = Memory.profiler.data[key as string].time;
    result = {};
    result.name = `${key as string}`;
    result.calls = calls;
    result.cpuPerCall = time / calls;
    result.callsPerTick = calls / totalTicks;
    result.cpuPerTick = time / totalTicks;
    totalCpu += result.cpuPerTick;

    return result as OutputData;
  });

  data.sort((lhs, rhs) => rhs.cpuPerTick - lhs.cpuPerTick);

  // /////
  // Format data
  let output = "";

  // get function name max length
  const longestName = _.max(data, dest => dest.name?.length).name?.length + 2;

  // // Header line
  output += _.padRight("Function", longestName);
  output += _.padLeft("Total Calls", 12);
  output += _.padLeft("CPU/Call", 12);
  output += _.padLeft("Calls/Tick", 12);
  output += _.padLeft("CPU/Tick", 12);
  output += _.padLeft("% of Tot\n", 12);

  // //  Data lines
  data.forEach(d => {
    output += _.padRight(`${d.name}`, longestName);
    output += _.padLeft(`${d.calls}`, 12);
    output += _.padLeft(`${d.cpuPerCall.toFixed(2)}ms`, 12);
    output += _.padLeft(`${d.callsPerTick.toFixed(2)}`, 12);
    output += _.padLeft(`${d.cpuPerTick.toFixed(2)}ms`, 12);
    output += _.padLeft(`${((d.cpuPerTick / totalCpu) * 100).toFixed(0)} %\n`, 12);
  });

  // // Footer line
  output += `${totalTicks} total ticks measured`;
  output += `\t\t\t${totalCpu.toFixed(2)} average CPU profiled per tick`;

  console.log(output);
}

// debugging
// function printObject(obj: object) {
//   const name = obj.constructor ? obj.constructor.name : (obj as any).name;
//   console.log("  Keys of :", name, ":");
//   Reflect.ownKeys(obj).forEach((k) => {
//     try {
//       console.log(`    ${k}: ${Reflect.get(obj, k)}`);
//     } catch (e) {
//       // nothing
//     }
//   });
// }

export interface Subject {
  /**
   * Intialise subject
   */
  initialise(): void;

  /**
   * Perform logic loop
   */
  loop(): void;

  /**
   * Cleanup afterwards
   */
  cleanup(): void;
}

export class Controller<TSubject extends Subject> {
  /**
   * Collection of subjects to be controlled.
   */
  public subjects: Map<string, TSubject> = new Map();

  /**
   * Register a new TSubject with lifecycle functions
   * Note: This is called automatically by the constructor for each TSubject
   */
  public register(subject: TSubject, subjectName: string): void {
    this.subjects.set(subjectName, subject);
  }

  /**
   * Initialise all services
   * Note: Invoked every global reset
   */
  public initialise(): void {
    this.subjects.forEach(subject => {
      subject.initialise();
    });
  }

  /**
   * Perform logic loop
   * Note: Invoked every tick.
   */
  public loop(): void {
    this.subjects.forEach(subject => {
      subject.loop();
    });
  }

  /**
   * Cleanup after logic loop
   * Note: Invoked every tick.
   */
  public cleanup(): void {
    this.subjects.forEach(subject => {
      subject.cleanup();
    });
  }
}

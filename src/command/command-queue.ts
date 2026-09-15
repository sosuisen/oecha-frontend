import { Command } from './command';

export class CommandQueue {
  private readonly commands: Command[] = [];
  private cursor: number = 0;

  length(): number {
    return this.commands.length;
  }

  enqueue(command: Command): void {
    this.commands.push(command);
  }

  currentCommand(): Command | null {
    if (this.cursor < this.commands.length) {
      return this.commands[this.cursor];
    }
    return null;
  }

  /**
   * Executes the current command
   * and moves the cursor to the next command in the queue.
   * If there are no more commands, it does nothing.
   */
  step(): void {
    const command = this.currentCommand();
    if (command) {
      command.execute();
    }
    this.advance();
  }

  /**
   * Moves the cursor to the next command in the queue without executing it.
   * The cursor may advance up to the index just past the last command,
   * but no farther.
   */
  advance(): void {
    if (this.cursor < this.commands.length) {
      this.cursor++;
    }
  }
}

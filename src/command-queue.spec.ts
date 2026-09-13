import { describe, it, expect } from 'vitest';
import { DrawCommand } from './draw-command';
import { Layer } from './layer';
import { CommandQueue } from './command-queue';

function createFakeCommand(
  layer = new Layer('Layer01'),
  onExecute: () => void = () => {},
): DrawCommand {
  return new (class extends DrawCommand {
    execute(): void {
      onExecute();
    }
    addPoint(): void {}
    onPointerDown(): void {}
    onPointerMove(): void {}
    onPointerUp(): void {}
  })(layer);
}

// CommandQueue のテスト
describe('CommandQueue', () => {
  // コマンドをキューに追加すると、キューのコマンドリストに追加される
  it('can add commands to the queue', () => {
    const queue = new CommandQueue();
    const command1 = createFakeCommand();
    expect(queue.length()).toEqual(0);
    queue.enqueue(command1);
    expect(queue.length()).toEqual(1);
  });

  // 現在のコマンドを取得できる
  it('can get the current command to execute', () => {
    const queue = new CommandQueue();
    const command1 = createFakeCommand();
    queue.enqueue(command1);
    expect(queue.currentCommand()).toEqual(command1);
  });

  // キューにコマンドがない場合、現在のコマンドは null を返す
  it('returns null if there are no commands in the queue', () => {
    const queue = new CommandQueue();
    expect(queue.currentCommand()).toBeNull();
  });

  // 現在のコマンドを実行できる
  it('can execute the current command', () => {
    const queue = new CommandQueue();
    let executed = false;
    const command1 = createFakeCommand(new Layer('Layer01'), () => {
      executed = true;
    });
    queue.enqueue(command1);
    queue.step();
    expect(executed).toBe(true);
  });

  // 現在のコマンドを実行すると、終了後に次のコマンドへ進めることができる。
  it('can move to the next command after executing the current command', () => {
    const queue = new CommandQueue();
    const command1 = createFakeCommand();
    const command2 = createFakeCommand();
    queue.enqueue(command1);
    queue.enqueue(command2);
    expect(queue.currentCommand()).toEqual(command1);
    queue.step();
    expect(queue.currentCommand()).toEqual(command2);
  });

  // カーソルのみを進めることができる
  it('can move the cursor to the next command without executing', () => {
    const queue = new CommandQueue();
    const command1 = createFakeCommand();
    const command2 = createFakeCommand();
    queue.enqueue(command1);
    queue.enqueue(command2);
    expect(queue.currentCommand()).toEqual(command1);
    queue.advance();
    expect(queue.currentCommand()).toEqual(command2);
  });
});

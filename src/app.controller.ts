import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Inspector = require('inspector-api');

@Controller()
export class AppController {
  private readonly inspector = new Inspector();

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/profile/cpu')
  async makeCPUProfile() {
    await this.inspector.profiler.enable();
    await this.inspector.profiler.start();

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const profileBuffer = await this.inspector.profiler.stop();
    await this.inspector.profiler.disable();

    return profileBuffer;
  }

  @Post('/profile/heap-snapshot')
  async makeHeapSnapshot() {
    return this.inspector.heap.takeSnapshot();
  }
}

import { Module } from '@nestjs/common';

import { CoreEngineModule } from 'src/engine/core-modules/core-engine.module';
import { JobsModule } from 'src/engine/core-modules/message-queue/jobs.module';
import { MessageQueueModule } from 'src/engine/core-modules/message-queue/message-queue.module';
import { GlobalWorkspaceDataSourceModule } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-datasource.module';
import { TwentyORMModule } from 'src/engine/twenty-orm/twenty-orm.module';
import { WorkspaceEventEmitterModule } from 'src/engine/workspace-event-emitter/workspace-event-emitter.module';
import { OrderEmailProcessorModule } from 'src/modules/custom/order-email-processor/order-email-processor.module';

@Module({
  imports: [
    CoreEngineModule,
    MessageQueueModule.registerExplorer(),
    WorkspaceEventEmitterModule,
    JobsModule,
    TwentyORMModule,
    GlobalWorkspaceDataSourceModule,
    // Custom modules (project-specific extensions): register here too so the
    // worker process has the listener wired to the same EventEmitter that
    // emits ORDER_EMAIL_EVENT after messaging save (which runs in the worker).
    OrderEmailProcessorModule,
  ],
})
export class QueueWorkerModule {}

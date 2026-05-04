import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { SimulateOrderEmailCommand } from 'src/modules/custom/order-email-processor/commands/simulate-order-email.command';
import { OrderEmailProcessorListener } from 'src/modules/custom/order-email-processor/listeners/order-email-processor.listener';
import { OrderEmailProcessorService } from 'src/modules/custom/order-email-processor/services/order-email-processor.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceEntity])],
  providers: [
    OrderEmailProcessorService,
    OrderEmailProcessorListener,
    SimulateOrderEmailCommand,
  ],
})
export class OrderEmailProcessorModule {}

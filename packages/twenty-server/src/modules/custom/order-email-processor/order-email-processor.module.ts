import { Module } from '@nestjs/common';

import { OrderEmailProcessorListener } from 'src/modules/custom/order-email-processor/listeners/order-email-processor.listener';
import { OrderEmailProcessorService } from 'src/modules/custom/order-email-processor/services/order-email-processor.service';

@Module({
  providers: [OrderEmailProcessorService, OrderEmailProcessorListener],
})
export class OrderEmailProcessorModule {}

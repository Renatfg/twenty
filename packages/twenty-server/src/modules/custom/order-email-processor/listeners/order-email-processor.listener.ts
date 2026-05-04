import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { ORDER_EMAIL_EVENT } from 'src/modules/custom/order-email-processor/order-email-processor.constants';
import { OrderEmailProcessorService } from 'src/modules/custom/order-email-processor/services/order-email-processor.service';
import { type MessageWithParticipants } from 'src/modules/messaging/message-import-manager/types/message';

export type OrderEmailProcessorEventPayload = {
  workspaceId: string;
  messages: MessageWithParticipants[];
};

@Injectable()
export class OrderEmailProcessorListener {
  private readonly logger = new Logger(OrderEmailProcessorListener.name);

  constructor(private readonly service: OrderEmailProcessorService) {}

  @OnEvent(ORDER_EMAIL_EVENT, { async: true })
  async handle(payload: OrderEmailProcessorEventPayload): Promise<void> {
    try {
      await this.service.processMessages(payload.messages, payload.workspaceId);
    } catch (error) {
      this.logger.error(
        `Order email processor failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }
}

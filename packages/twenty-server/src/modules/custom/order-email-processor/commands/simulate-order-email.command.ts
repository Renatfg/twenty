import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Command, CommandRunner, Option } from 'nest-commander';
import { MessageParticipantRole } from 'twenty-shared/types';
import { Repository } from 'typeorm';

import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { MessageDirection } from 'src/modules/messaging/common/enums/message-direction.enum';
import { type MessageWithParticipants } from 'src/modules/messaging/message-import-manager/types/message';
import { OrderEmailProcessorService } from 'src/modules/custom/order-email-processor/services/order-email-processor.service';

type SimulateOrderEmailOptions = {
  workspaceId?: string;
  email?: string;
  name?: string;
  subject?: string;
  body?: string;
};

const DEFAULT_BODY = `Здравствуйте!

Меня зовут Иван Тестов.
Хочу разместить заказ на ваши услуги.
Свяжитесь со мной по телефону +7 (999) 123-45-67
Сайт нашей компании: https://test-customer.example.com

С уважением, Иван Тестов`;

@Command({
  name: 'order-email-processor:simulate',
  description:
    'Simulate an incoming order email and run OrderEmailProcessor on it (no real IMAP/SMTP needed)',
})
export class SimulateOrderEmailCommand extends CommandRunner {
  private readonly logger = new Logger(SimulateOrderEmailCommand.name);

  constructor(
    private readonly orderEmailProcessorService: OrderEmailProcessorService,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
  ) {
    super();
  }

  @Option({
    flags: '-w, --workspace-id <id>',
    description: 'Workspace id; defaults to the first workspace in DB',
    required: false,
  })
  parseWorkspaceId(val: string): string {
    return val;
  }

  @Option({
    flags: '-e, --email <email>',
    description: 'Sender email; defaults to test@example.com',
    required: false,
  })
  parseEmail(val: string): string {
    return val;
  }

  @Option({
    flags: '-n, --name <name>',
    description: 'Sender display name (header); defaults to "Тестовый Клиент"',
    required: false,
  })
  parseName(val: string): string {
    return val;
  }

  @Option({
    flags: '-s, --subject <subject>',
    description: 'Email subject; defaults to "Заказ от тестового клиента"',
    required: false,
  })
  parseSubject(val: string): string {
    return val;
  }

  @Option({
    flags: '-b, --body <body>',
    description: 'Email body; defaults to a template containing phone and URL',
    required: false,
  })
  parseBody(val: string): string {
    return val;
  }

  async run(
    _passedParams: string[],
    options: SimulateOrderEmailOptions,
  ): Promise<void> {
    const workspaceId =
      options.workspaceId ?? (await this.resolveDefaultWorkspaceId());
    const email = options.email ?? 'test@example.com';
    const displayName = options.name ?? 'Тестовый Клиент';
    const subject = options.subject ?? 'Заказ от тестового клиента';
    const body = options.body ?? DEFAULT_BODY;

    this.logger.log(`Simulating order email for workspace ${workspaceId}`);
    this.logger.log(`From: "${displayName}" <${email}>`);
    this.logger.log(`Subject: ${subject}`);

    const message: MessageWithParticipants = {
      headerMessageId: `simulated-${Date.now()}@order-processor.local`,
      subject,
      text: body,
      receivedAt: new Date(),
      externalId: `simulated-${Date.now()}`,
      messageThreadExternalId: `simulated-thread-${Date.now()}`,
      direction: MessageDirection.INCOMING,
      attachments: [],
      participants: [
        {
          role: MessageParticipantRole.FROM,
          handle: email,
          displayName,
        },
        {
          role: MessageParticipantRole.TO,
          handle: 'inbox@magnum-vega.ru',
          displayName: '',
        },
      ],
    };

    await this.orderEmailProcessorService.processMessages(
      [message],
      workspaceId,
    );

    this.logger.log(
      'Done. Run the verification SQL printed in the docs to inspect klient and note.',
    );
  }

  private async resolveDefaultWorkspaceId(): Promise<string> {
    const workspace = await this.workspaceRepository.findOne({
      where: {},
      order: { createdAt: 'ASC' },
    });

    if (!workspace) {
      throw new Error(
        'No workspace found in DB. Pass --workspace-id explicitly.',
      );
    }

    return workspace.id;
  }
}

import amqp from 'amqplib';
import { TranslationService } from '../services/TranslationService.js';

export class TranslationWorker {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.translationService = new TranslationService();
    this.isRunning = false;
  }

  async start() {
    try {
      // Connect to RabbitMQ
      const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
      this.connection = await amqp.connect(rabbitUrl);
      this.channel = await this.connection.createChannel();

      // Declare the translation queue
      await this.channel.assertQueue('translation_queue', {
        durable: true
      });

      // Set prefetch to process one message at a time
      this.channel.prefetch(1);

      console.log('Translation worker started. Waiting for messages...');

      // Start consuming messages
      this.channel.consume('translation_queue', async (message) => {
        if (message !== null) {
          try {
            const translationData = JSON.parse(message.content.toString());
            console.log('Received translation job:', translationData.id);

            // Process the translation
            await this.translationService.processTranslation(translationData);

            // Acknowledge the message
            this.channel.ack(message);
            console.log('Translation job completed:', translationData.id);

          } catch (error) {
            console.error('Error processing translation job:', error);
            
            // Reject and requeue the message (optional: you might want to implement a dead letter queue)
            this.channel.nack(message, false, false);
          }
        }
      });

      this.isRunning = true;

      // Handle graceful shutdown
      process.on('SIGTERM', () => this.stop());
      process.on('SIGINT', () => this.stop());

    } catch (error) {
      console.error('Failed to start translation worker:', error);
      throw error;
    }
  }

  async stop() {
    console.log('Stopping translation worker...');
    
    this.isRunning = false;

    if (this.channel) {
      await this.channel.close();
    }

    if (this.connection) {
      await this.connection.close();
    }

    console.log('Translation worker stopped');
    process.exit(0);
  }
}

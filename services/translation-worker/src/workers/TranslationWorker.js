import amqp from 'amqplib';
import { TranslationService } from '../services/TranslationService.js';
import { LanguageDetectionService } from '../services/LanguageDetectionService.js';

export class TranslationWorker {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.translationService = new TranslationService();
    this.languageDetectionService = new LanguageDetectionService();
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

      // Declare the language detection queue
      await this.channel.assertQueue('language_detection_queue', {
        durable: true
      });

      // Set prefetch to process one message at a time
      this.channel.prefetch(1);

      console.log('Translation worker started. Waiting for messages...');

      // Start consuming translation messages
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

      // Start consuming language detection messages
      this.channel.consume('language_detection_queue', async (message) => {
        if (message !== null) {
          try {
            const detectionData = JSON.parse(message.content.toString());
            console.log('Received language detection job:', detectionData.id);

            // Process the language detection
            await this.languageDetectionService.processLanguageDetection(detectionData);

            // Acknowledge the message
            this.channel.ack(message);
            console.log('Language detection job completed:', detectionData.id);

          } catch (error) {
            console.error('Error processing language detection job:', error);
            
            // Reject and requeue the message
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

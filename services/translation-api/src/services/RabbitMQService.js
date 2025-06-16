import amqp from 'amqplib';

export class RabbitMQService {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
      this.connection = await amqp.connect(rabbitUrl);
      this.channel = await this.connection.createChannel();
      
      // Declare the translation queue
      await this.channel.assertQueue('translation_queue', {
        durable: true
      });

      this.isConnected = true;
      console.log('Connected to RabbitMQ');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      throw error;
    }
  }

  async publishTranslationJob(translationData) {
    if (!this.isConnected) {
      await this.connect();
    }

    const message = JSON.stringify(translationData);
    this.channel.sendToQueue('translation_queue', Buffer.from(message), {
      persistent: true
    });

    console.log('Translation job published:', translationData.id);
  }

  async close() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
    this.isConnected = false;
  }
}

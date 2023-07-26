import { registerAs } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

export default registerAs('microservice-restaurants', () => {
  const natsServers = (
    process.env.RESTAURANTS_SERVICE_NATS_SERVERS || 'nats://localhost:4222'
  )
    .split(',')
    .map((server) => server.trim());
  return {
    transport: Transport.NATS,
    options: {
      servers: natsServers,
    },
  };
});

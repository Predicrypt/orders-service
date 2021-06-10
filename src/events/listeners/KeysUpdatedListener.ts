import {
  KeysUpdatedEventInterface,
  ListenerAbstract,
  SubjectEnum,
  UserRegisteredEventInterface,
} from '@Predicrypt/common';
import { Message } from 'node-nats-streaming';
import User, { UserDoc } from '../../models/userModel';
import { queueGroupName } from './queueGroupName';
export class KeysRegisteredListener extends ListenerAbstract<KeysUpdatedEventInterface> {
  subject: SubjectEnum.KeysUpdated = SubjectEnum.KeysUpdated;
  queueGroupName: string = queueGroupName;
  async onMessage(data: KeysUpdatedEventInterface['data'], msg: Message) {
    const { userId, apiKey, secretKey } = data;
    console.log(data);

    const user: UserDoc = await User.findOne({ userId });
    user.apiKey = apiKey;
    user.secretKey = secretKey;
    await user.save();

    msg.ack();
  }
}

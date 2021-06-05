import {
  ListenerAbstract,
  SubjectEnum,
  UserRegisteredEventInterface,
} from '@Predicrypt/common';
import { Message } from 'node-nats-streaming';
import User from '../../models/userModel';
import { queueGroupName } from './queueGroupName';
export class UserRegisteredListener extends ListenerAbstract<UserRegisteredEventInterface> {
  subject: SubjectEnum = SubjectEnum.UserRegistered;
  queueGroupName: string = queueGroupName;
  async onMessage(data: UserRegisteredEventInterface['data'], msg: Message) {
    const { userId, email } = data;
    console.log(data);

    const user = User.build({ userId, email });

    await user.save();

    msg.ack();
  }
}

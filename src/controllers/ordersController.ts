import {
  BadRequestError,
  BinanceClient,
  NoApiKeyError,
} from '@Predicrypt/common';
import {
  OrderStatus,
  OrderTypes,
  TimeInForce,
} from '@Predicrypt/common/build/binance/enums';
import {
  CancelOrderRequest,
  NewLimitOrderRequest,
  NewMarketOrderRquest,
  OpenOrdersRequest,
} from '@Predicrypt/common/build/binance/interfaces/SpotTrade';
import { Request, response, Response } from 'express';
import User, { UserDoc } from '../models/userModel';

export const makeOrder = async (req: Request, res: Response) => {
  const { type, symbol, side, quantity, price } = req.body;

  const spotRequest: NewLimitOrderRequest | NewMarketOrderRquest = {
    symbol,
    side,
    quantity: Number(quantity),
    timestamp: Date.now(),
  };

  const user: UserDoc = await User.findByUserId(req.currentUser?.id!);
  checkApiKey(user);

  if (user) {
    const client = new BinanceClient(user.apiKey, user.secretKey);
    let response;
    if (type === OrderTypes.LIMIT) {
      spotRequest.timeInForce = TimeInForce.GTC;
      response = await client.newLimitOrder(
        spotRequest as NewLimitOrderRequest
      );
    }

    if (type === OrderTypes.MARKET) {
      response = await client.newMarketOrder(
        spotRequest as NewMarketOrderRquest
      );
    }
    if (response && response.data.clientOrderId) {
      res.status(201).send(response.data);
    } else {
      throw new BadRequestError('Cannot process the request');
    }
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  const { symbol, orderId } = req.body;

  const cancelOrderRequest: CancelOrderRequest = {
    symbol,
    orderId,
    timestamp: Date.now(),
  };

  const user: UserDoc = await User.findByUserId(req.currentUser?.id!);
  checkApiKey(user);

  if (user) {
    const client = new BinanceClient(user.apiKey, user.secretKey);
    const response = await client.cancelOrder(cancelOrderRequest);

    if (response.data.status === OrderStatus.CANCELED) {
      res.status(200).send(response.data);
    } else {
      throw new BadRequestError('Cannot process the request');
    }
  }
};

export const getActiveOrders = async (req: Request, res: Response) => {
  const openOrderRequest: OpenOrdersRequest = {
    timestamp: Date.now(),
  };

  if (req.params.symbol) {
    openOrderRequest.symbol = req.params.symbol;
  }

  const user: UserDoc = await User.findByUserId(req.currentUser?.id!);
  checkApiKey(user);
  if (user) {
    const client = new BinanceClient(user.apiKey, user.secretKey);

    const response = await client.currentOpenOrders(openOrderRequest);

    if (response) {
      res.status(200).send(response.data);
    } else {
      throw new BadRequestError('Cannot process the request');
    }
  }
};

const checkApiKey = (user: UserDoc) => {
  if (user.apiKey && user.secretKey) {
    return;
  }

  throw new NoApiKeyError();
};

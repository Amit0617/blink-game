import {
  ActionPostResponse,
  ActionGetResponse,
  ActionPostRequest,
  createActionHeaders,
} from '@solana/actions';
import { PublicKey } from '@solana/web3.js';

const headers = createActionHeaders();

export const GET = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const pubKey = 'DAvUgsdF9SHb4d7aiSqExoPtR37jsgjAV3XUbgZNUpJc';
    const baseHref = new URL(
      `/api/actions/read-mind?to=${pubKey}`,
      requestUrl.origin,
    ).toString();

    const payload: ActionGetResponse = {
      type: 'action',
      title: 'Play the Telepathic Wikipedia Game',
      icon: `${requestUrl.origin}/homepage.png`,
      description:
        'Think of a three-digit number, follow the steps, and see the prediction!',
      label: 'Start the Game (Inserting a Coin)',
      links: {
        actions: [
          {
            type: 'post',
            label: "Let's Play!",
            href: `${baseHref}`,
          },
        ],
      },
    };

    return Response.json(payload, { headers });
  } catch (err) {
    console.log(err);
    let message = 'An error occurred while processing the request';
    if (typeof err === 'string') {
      message = err;
    }
    return new Response(message, { status: 400, headers });
  }
};

export const OPTIONS = async (req: Request) => {
  return new Response(null, { headers });
};

export const POST = async (req: Request) => {
  try {
    const payload: ActionPostResponse = {
      type: 'post',
      links: {
        next: {
          type: 'post',
          href: '/api/actions/read-mind/next/1',
        },
      },
    };

    return Response.json(payload, {
      headers,
    });
  } catch (err) {}
};

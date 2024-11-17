import {
  ActionPostResponse,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
  createActionHeaders,
} from '@solana/actions';
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

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
            type: 'transaction',
            label: 'Begin Game (Custom Amount)',
            href: `${baseHref}&amount={amount}`,
            parameters: [
              {
                name: 'amount',
                label: 'Enter the amount of SOL to start the game',
                required: true,
              },
            ],
          },
          {
            type: 'transaction',
            label: 'Begin Game (0.1 SOL)',
            href: `${baseHref}&amount=${'0.1'}`,
          },
          {
            type: 'transaction',
            label: 'Begin Game (1 SOL)',
            href: `${baseHref}&amount=${'1'}`,
          },
          {
            type: 'transaction',
            label: 'Begin Game (5 SOL)',
            href: `${baseHref}&amount=${'5'}`,
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
    const requestUrl = new URL(req.url);
    const { amount } = validatedQueryParams(requestUrl);
    const pubKey: PublicKey = new PublicKey(
      'DAvUgsdF9SHb4d7aiSqExoPtR37jsgjAV3XUbgZNUpJc',
    );
    const body: ActionPostRequest = await req.json();
    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers,
      });
    }

    const connection = new Connection(
      process.env.SOLANA_RPC! || clusterApiUrl('mainnet-beta'),
    );

    const minimumBalance = await connection.getMinimumBalanceForRentExemption(
      0,
    );

    // create an instruction to transfer native SOL from one wallet to another
    const transferSolInstruction = SystemProgram.transfer({
      fromPubkey: account,
      toPubkey: pubKey,
      lamports: amount * LAMPORTS_PER_SOL,
    });

    // get the latest blockhash amd block height
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    // create a legacy transaction
    const transaction = new Transaction({
      feePayer: account,
      blockhash,
      lastValidBlockHeight,
    }).add(transferSolInstruction);

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        type: 'transaction',
        transaction,
        message: `Sent ${amount} SOL to MindReader: ${pubKey.toBase58()}`,
        links: {
          next: {
            type: 'post',
            href: '/api/actions/read-mind/next/1',
          },
        },
      },
    });

    return Response.json(payload, {
      headers,
    });
  } catch (err) {}
};

function validatedQueryParams(requestUrl: URL) {
  let amount: number = 0.1;

  try {
    if (requestUrl.searchParams.get('amount')) {
      amount = parseFloat(requestUrl.searchParams.get('amount')!);
    }

    if (amount <= 0) throw 'amount is too small';
  } catch (err) {
    throw 'Invalid input query parameter: amount';
  }
  return { amount };
}

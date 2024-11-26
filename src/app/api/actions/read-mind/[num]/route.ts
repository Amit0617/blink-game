import {
  ActionPostResponse,
  createPostResponse,
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
      process.env.SOLANA_RPC || clusterApiUrl('mainnet-beta'),
    );
    const num = Number(requestUrl.pathname.split('/').pop());
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

    const baseHref = new URL(
      `/api/actions/read-mind`,
      requestUrl.origin,
    ).toString();

    if (num < 6) {
      let payload: ActionPostResponse = {
        type: 'post',
        links: {
          next: {
            type: 'post',
            href: `${baseHref}/next/${num + 1}`,
          },
        },
      };

      return Response.json(payload, { headers });
    } else {
      let payload: ActionPostResponse = await createPostResponse({
        fields: {
          type: 'transaction',
          transaction,
          message: `Sent ${amount} SOL to MindReader: ${pubKey.toBase58()}`,
          links: {
            next: {
              type: 'inline',
              action: {
                type: 'action',
                icon: `${requestUrl.origin}/homepage.png`,
                label: 'Thank you!',
                title: 'Donate to the MindReader',
                disabled: true,
                description: 'Support the MindReader with a donation.',
              },
            },
          },
        },
      });

      return Response.json(payload, { headers });
    }
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

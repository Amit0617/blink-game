import { ActionPostResponse, createActionHeaders } from '@solana/actions';

const headers = createActionHeaders();

export const POST = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const num = Number(requestUrl.pathname.split('/').pop());
    const baseHref = new URL(
      `/api/actions/read-mind`,
      requestUrl.origin,
    ).toString();

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

import { Action, createActionHeaders } from '@solana/actions';

const headers = createActionHeaders();

export const POST = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const num = requestUrl.pathname.split('/').pop();
    const baseHref = new URL(
      `/api/actions/read-mind`,
      requestUrl.origin,
    ).toString();

    // generate a random number between 0 and 999
    const randomNumber = Math.floor(Math.random() * 1000);

    if (num == '1') {
      let payload: Action = {
        type: 'action',
        icon: 'http://127.0.0.1:3000/homepage.png',
        title:
          'Step 1: Reverse the Digits of Your Number and Subtract the Smaller from the Larger',
        description:
          'e.g. If you thought of 123, the result is 321 - 123 = 198.\n If you thought of 321, the result is 321 - 123 = 198.',
        label: 'Next',
        links: {
          actions: [
            {
              type: 'post',
              label: 'Next',
              href: `${baseHref}/1`,
            },
          ],
        },
      };
      return Response.json(payload, { headers });
    } else if (num == '2') {
      console.log('Step 2');
      let payload: Action = {
        type: 'action',
        icon: 'http://127.0.0.1:3000/homepage.png',
        title:
          'Step 2: Use the result and Reverse the Digits of Your Number. Then Add both numbers together.',
        description: 'e.g. If you got 456, the result is 456 + 654 = 1110.',
        label: 'Next',
        links: {
          actions: [
            {
              type: 'post',
              label: 'Next',
              href: `${baseHref}/2`,
            },
          ],
        },
      };
      return Response.json(payload, { headers });
    } else if (num === '3') {
      console.log('Step 3');
      let payload: Action = {
        type: 'action',
        icon: 'http://127.0.0.1:3000/homepage.png',
        title: `Step 3: Add Random Number to the Result: ${randomNumber}`,
        description: `e.g. If you got 1110, the result is 1110 + ${randomNumber} = ${
          1110 + randomNumber
        }.`,
        label: 'Next',
        links: {
          actions: [
            {
              type: 'post',
              label: 'Next',
              href: `${baseHref}/3`,
            },
          ],
        },
      };
      return Response.json(payload, { headers });
    } else if (num === '4') {
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

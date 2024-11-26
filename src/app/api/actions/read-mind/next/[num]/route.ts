import { Action, createActionHeaders } from '@solana/actions';
import JSDOM from 'jsdom';
const headers = createActionHeaders();

function splitNumber(num: number) {
  // Ensure the input is a 4-digit number
  if (num >= 1000 && num <= 9999) {
    const firstThreeDigits = Math.floor(num / 10); // Remove the last digit
    const lastDigit = num % 10; // Get the last digit

    return [firstThreeDigits, lastDigit];
  } else {
    return 'Input must be a 4-digit number';
  }
}

let response: {
  title: any;
  extract: any;
  description: any;
};

// generate a random number between 1 and 8900 (inclusive)
const randomNumber = Math.floor(Math.random() * 8900) + 1;

export const POST = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const num = requestUrl.pathname.split('/').pop();
    const baseHref = new URL(
      `/api/actions/read-mind`,
      requestUrl.origin,
    ).toString();

    const exampleNumber = 1234;

    if (num == '1') {
      let payload: Action = {
        type: 'action',
        icon: `${requestUrl.origin}/homepage.png`,
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
        icon: `${requestUrl.origin}/homepage.png`,
        title:
          'Step 2: Use the result and Reverse the Digits of Your Number. Then Add both numbers together.',
        description: 'e.g. If you got 789, the result is 789 + 987 = 1776.',
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
      console.log('Step 3', randomNumber);
      let payload: Action = {
        type: 'action',
        icon: `${requestUrl.origin}/homepage.png`,
        title: `Step 3: Add this randomly generated number to the result: ${randomNumber}`,
        description: `e.g. Let's say your sum is 1776, the result in that case would be 1776 + ${randomNumber} = ${
          1776 + randomNumber
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
      let payload: Action = {
        type: 'action',
        icon: `${requestUrl.origin}/how.png`,
        title:
          'Step 4: You must have a 4 digit number now! Enter the first 3 digits in Wikipedia index(https://en.wikipedia.org/wiki/Special:AllPages/{FirstThreeDigits}) and open the last digit article.',
        description: `e.g. If you got ${exampleNumber}, navigate to https://en.wikipedia.org/wiki/Special:AllPages/123 and open the 4th (start counting from 0) article.\n Make sure to keep it private! Open that link in incognito mode or maybe on another device. Open the article and think about the title and read a bit about it. We will try to guess the article.`,
        label: 'Next',
        links: {
          actions: [
            {
              type: 'post',
              label: 'Next',
              href: `${baseHref}/4`,
            },
          ],
        },
      };
      return Response.json(payload, { headers });
    } else if (num === '5') {
      let payload: Action = {
        type: 'action',
        icon: `${requestUrl.origin}/think.webp`,
        title: 'Step 5: Think of the Article and Click Next',
        description:
          'Think of the article title, specifically what is it, take a moment to craft a one liner in your mind to explain it to someone else. We are trying to match your brain waves!',
        label: 'Next',
        links: {
          actions: [
            {
              type: 'post',
              label: 'Next',
              href: `${baseHref}/5`,
            },
          ],
        },
      };
      return Response.json(payload, { headers });
    } else if (num === '6') {
      let numbers: any = splitNumber(1089 + randomNumber);
      console.log(numbers, randomNumber);
      if (numbers === 'Input must be a 4-digit number') {
        return new Response('Retry, There was some error!', {
          status: 500,
          headers,
        });
      }
      let el: any = new JSDOM.JSDOM().window.document.createElement('div');
      await fetch(`${process.env.WIKIPEDIA}${numbers[0]}/api.php`)
        .then((response) => {
          return response.text();
        })
        .then((data) => {
          // console.log(data);
          el.innerHTML = data;
        });
      let similarBrainWavesList =
        el.getElementsByClassName('mw-allpages-chunk')[0];
      let desiredArticle = similarBrainWavesList
        .getElementsByTagName('li')
        [numbers[1]].getElementsByTagName('a')[0].title;
      await fetch(`${process.env.WIKI_DB}${desiredArticle}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          response = data;
        });
      let payload: Action = {
        type: 'action',
        icon: `${requestUrl.origin}/homepage.png`,
        title: `Are you thinking of a ${response.description} ?`,
        description: `Is this article about ${response.title}? We found a great match: ${response.extract}`,
        label: 'Loved it!, Donate to the creator',
        links: {
          actions: [
            {
              type: 'transaction',
              label: 'Loved it! Donate to the creator',
              href: `${baseHref}/6?amount={amount}`,
              parameters: [
                {
                  name: 'amount',
                  label: 'Enter the amount of SOL to donate',
                  required: true,
                },
              ],
            },
            {
              type: 'external-link',
              label: 'Not Impressed? Play Again! (Free)',
              href: `${baseHref}`,
            },
          ],
        },
      };
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

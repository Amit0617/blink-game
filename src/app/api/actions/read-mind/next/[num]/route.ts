import { Action, createActionHeaders } from '@solana/actions';
import JSDOM from 'jsdom';
import { GoogleGenerativeAI } from '@google/generative-ai';

const headers = createActionHeaders();
const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash-8b',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: 'user',
      parts: [
        {
          text: 'Use the given summary and rephrase it like you are trying to read the mind of that person. Say one or two important identifying words about the content first then slowly uncover few sentences like you can sense what it is about and then give some description about it.\nFor example: Given response\n```\n{\n\t"title": "Myrcene",\n\t"description": "Chemical compound",\n\t"extract": "Myrcene, or β-myrcene, is a monoterpene. A colorless oil, it occurs widely in essential oils. It is produced mainly semi-synthetically from Myrcia, from which it gets its name. It is an intermediate in the production of several fragrances. An less-common isomeric form, having one of the three alkene units in a different position, is α-myrcene."\n}\n```\nResponse should be like\n```\nHmm... I am seeing something like ball and stick figures... Oh this reminds me of my chemistry classes!\nIs this about some chemical compound? Oh wait... I think I can read the name of compund.\n*Focussing hard with closed eyes*\nMycine... Myecin... Myrcene! β-myrcene is the name of compound. It is a monoterpene, colorless oil, occurs widely in essential oils. It is produced mainly semi-synthetically from Myrcia, from which it gets its name. It is an intermediate in the produciton of several fragrances. An less-common isomeric form, having one of the three alkene units in a different position, is α-myrcene.\n```',
        },
        {
          text: '```\n{\n\t"title": "123-125 George Street, The Rocks",\n\t"description": "Historic site in New South Wales, Australia",\n\t"extract": "123–125 George Street, The Rocks are heritage-listed shops and former residences located in the inner Sydney suburb of The Rocks in New South Wales, Australia. It was built for Thomas Playfair during 1882. The property is owned by Property NSW, an agency of the Government of New South Wales. It was added to the New South Wales State Heritage Register on 10 May 2002."\n}\n```',
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: "Hmm... I sense a historical building...perhaps a landmark?  Oh, I see addresses. 123-125 George Street... The Rocks...  Australia.  My mental map is unfolding!\n\nIs this about a significant property?  Yes, I believe so. I sense a building with a rich past.  The address suggests a particular location, the Rocks in Sydney, New South Wales, Australia.\n\n*Concentrating intently on the details in my mind's eye*...  This is about a heritage-listed building, perhaps shops or former residences? Built for Thomas Playfair in 1882, the location hints at an important architectural or historical period in the area. I see mentions of the New South Wales State Heritage Register, implying a considerable historical significance.  Ownership by Property NSW, an agency of the New South Wales government, further suggests its standing as a protected and important part of the cultural heritage of the area.\n",
        },
      ],
    },
    {
      role: 'user',
      parts: [
        {
          text: '```\n{\n\t"title": "1400s (decade)",\n\t"description": "Decade of the Gregorian calendar (1400–1409)",\n\t"extract": "The 1400s ran from January 1, 1400, to December 31, 1409."\n}\n```',
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: "Hmm... I'm seeing numbers...  A decade!  The 1400s!\n\nOh, I see, this is about a specific period of time.  A decade in the Gregorian calendar.\n\nIt appears to be defining the span of the 1400s.  Beginning January 1, 1400, and ending on December 31, 1409.  Just a simple description of the dates marking the decade.\n",
        },
      ],
    },
  ],
});

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
        }. Important: Sometimes the random number do not refresh, in that case, copy the url, close the tab and open the url again. Or open the url in incognito mode.`,
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
        [numbers[1] + 1].getElementsByTagName('a')[0].title;
      console.log(similarBrainWavesList.getElementsByTagName('li'));
      await fetch(`${process.env.WIKI_DB}${desiredArticle}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          response = data;
        });
      const result = await chatSession.sendMessage(
        `{"title": ${response.title}, "description": ${response.description}, "extract": ${response.extract}}`,
      );

      let payload: Action = {
        type: 'action',
        icon: `${requestUrl.origin}/homepage.png`,
        title: 'Hmm...',
        description: `${result.response.text()}`,
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

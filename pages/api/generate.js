import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          'OpenAI API key not configured, please follow instructions in README.md',
      },
    });
    return;
  }

  const job_title = req.body.job_title || '';
  const city = req.body.city || '';
  const year = req.body.years_of_experience || '';

  if (job_title.trim().length === 0) {
    res.status(400).json({
      error: {
        message: 'Please enter a valid job title',
      },
    });
    return;
  }

  if (city.trim().length === 0) {
    res.status(400).json({
      error: {
        message: 'Please enter a valid city',
      },
    });
    return;
  }

  if (year.trim().length === 0) {
    res.status(400).json({
      error: {
        message: 'Please enter a valid year',
      },
    });
    return;
  }

  console.log('Prompt is: ' + generatePrompt(job_title, city, year));

  try {
    const completion = await openai.createCompletion({
      model: 'gpt-3.5-turbo',
      prompt: generatePrompt(job_title, city, year),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].message });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        },
      });
    }
  }
}

function generatePrompt(job_title, city, year) {
  const capitalizedJob =
    job_title[0].toUpperCase() + job_title.slice(1).toLowerCase();
  const capitalizedCity = city[0].toUpperCase() + city.slice(1).toLowerCase();

  return `Find the average salary for a ${capitalizedJob}, working in ${city}, with ${year} years of experience.`;
}

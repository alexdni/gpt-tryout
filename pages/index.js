import Head from 'next/head';
import { useState } from 'react';
import styles from './index.module.css';

export default function Home() {
  const [jobInput, setJobInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [yearInput, setYearInput] = useState('');

  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_title: jobInput,
          city: cityInput,
          years_of_experience: yearInput,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setJobInput('');
      setCityInput('');
      setYearInput('');
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Job evaluator</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>How much does my job pay?</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="job_title"
            placeholder="Enter your job title"
            value={jobInput}
            onChange={(e) => setJobInput(e.target.value)}
          />
          <input
            type="text"
            name="city"
            placeholder="Enter your city"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
          />
          <input
            type="text"
            name="years_of_experience"
            placeholder="Enter your years of experience"
            value={yearInput}
            onChange={(e) => setYearInput(e.target.value)}
          />
          <input type="submit" value="Generate Salary" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}

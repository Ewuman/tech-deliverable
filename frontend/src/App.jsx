import { useEffect, useState } from "react";
import "./App.css";
import Quote from "./Quote.jsx"

function App() {
	const [quotes, setQuotes] = useState([])

	useEffect(() => {
		// fetch('/api/getQuotes')
		// .then(response => response.json())
		// .then(json => setQuotes(json))
		// .catch(error => console.error(error))
		fetchQuotes();
	}, []);

	const fetchQuotes = async (maxAge = 0) => {
        try {
            const response = await fetch(`/api/getQuotesByAge?max_age=${maxAge}`);
            if (!response.ok) {
                throw new Error("Failed to fetch quotes");
            }
            const json = await response.json();
            setQuotes(json);
        } catch (error) {
            console.error(error);
        }
    };

	return (
		<div className="App">
			{/* TODO: include an icon for the quote book */}
			<h1>Hack at UCI Tech Deliverable</h1>

			<h2>Submit a quote</h2>
			{/* TODO: implement custom form submission logic to not refresh the page */}
			<form action="/api/quote" method="post">
				<label htmlFor="input-name">Name</label>
				<input type="text" name="name" id="input-name" required />
				<label htmlFor="input-message">Quote</label>
				<input type="text" name="message" id="input-message" required />
				<button type="submit">Submit</button>
			</form>

			<div className="dates">
				View posts from
				<button onClick={() => fetchQuotes(7)}>Last week</button>
				<button onClick={() => fetchQuotes(30)}>Last month</button>
				<button onClick={() => fetchQuotes(365)}>Last year</button>
				<button onClick={() => fetchQuotes(0)}>All posts</button>
			</div>

			<h2>Previous Quotes</h2>
			{/* TODO: Display the actual quotes from the database */}
			<div className="messages">
				{quotes.map(quote => <Quote quote={quote}/>)}
			</div>
		</div>
	);
}

export default App;

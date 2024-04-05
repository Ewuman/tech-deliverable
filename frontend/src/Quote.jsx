function Quote({quote}) {
    return (
        <div>{quote.name} {quote.message} {quote.time}</div>
    );
}

export default Quote;
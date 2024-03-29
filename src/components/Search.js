export default function Search({ term, setTerm }) {

    return (
        <div className="form-outline">
            <input
                onChange={e => setTerm(e.target.value)}
                value={term}
                className="form-control"
                type="text"
                name="searchProducts"
                id="searchProducts"
                placeholder={`Busca por el nombre del cliente o del destinatario`} />
        </div>
    )
}
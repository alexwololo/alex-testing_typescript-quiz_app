import { Link, useRouteError } from "react-router-dom";
import { RouteError } from "../../interfaces/RouteError";

export default function ErrorPage() {
    const error = useRouteError() as RouteError;
    console.error(error);

    return (
        <section className="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
            <Link to="/" className="style-primary">
                Go Home
            </Link>
        </section>
    );
}

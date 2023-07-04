import { Factory, Product } from "blp";

import Location from "src/entity/location/global";
import { ParseResult } from "src/translator/Parser";

export default abstract class ParseWorker
{
    abstract applyTo(parseResult: ParseResult): void;

    location: Location;
    extra;

    step(product: Product, factory: Factory<Product>): void | Product {}
    finally() {}
}
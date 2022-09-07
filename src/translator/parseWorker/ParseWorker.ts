import { Factory, Product } from "blp";

import { ParseResult } from "src/translator/Parser";

export default abstract class ParseWorker
{
    abstract applyTo(parseResult: ParseResult): void;

    location: string;

    step(product: Product, factory: Factory<Product>): void | Product {}
    finally() {}
}
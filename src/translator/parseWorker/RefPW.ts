import { throwMetaError } from "@cmtv/error-meta";
import { Block, Inliner } from "blp";

import DbRef from "src/entity/ref/db";
import RefAlias from "src/translator/block/refAlias/block";
import Link from "src/translator/inliner/link/inliner";
import { ParseResult } from "src/translator/Parser";
import Include from "src/translator/block/include/block";

import ParseWorker from "./ParseWorker";

export default class RefPW extends ParseWorker
{
    refs: DbRef[] = [];
    refAliasMap = {};

    step(product: Block | Inliner)
    {
        if (product instanceof RefAlias)
        {
            this.refAliasMap = {...this.refAliasMap, ...product.aliasMap};
            return null;
        }

        if (product instanceof Link)
        {
            let ref = new DbRef;
                ref.from = this.location.getFullId();
                ref.target = product.target;

            this.refs.push(ref);
        }

        if (product instanceof Include)
        {
            let ref = new DbRef;
                ref.from = this.location.getFullId();
                ref.target = product.id;

            this.refs.push(ref);
        }
    }

    finally()
    {
        this.refs.forEach(ref =>
        {
            let firstLetter = ref.target.at(0);

            if (firstLetter === '^')
            {
                let alias = ref.target.slice(1);
                
                if (!(alias in this.refAliasMap))
                    throwMetaError('Unknow ref alias!', {
                        Alias: alias
                    });

                ref.target = this.refAliasMap[alias];
            }

            if (ref.target.startsWith('http'))
                return;

            if (firstLetter !== '@')
                ref.target = this.location.getFullId() + '/' + ref.target;
        });
    }

    applyTo(parseResult: ParseResult)
    {
        parseResult.refs = [...this.refs];
    }   
}
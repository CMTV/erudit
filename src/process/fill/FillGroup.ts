import EruditGroup from "src/process/EruditGroup";

// Processes
import FillContributors from "./FillContributors";
import FillShelvesBooks from "./FillShelvesBooks";
import FillBookTocs from "./FillBookTocs";
import FillTopics from "./FillTopics";
import FillTopicTocs from "./FillTopicTocs";
import UniqueRefCheckout from "./UniqueRefCheckout";
import FillSponsors from "./FillSponsors";

export default class FillGroup extends EruditGroup
{
    name = 'Parse data and fill database';

    getProcessTypes()
    {
        return [
            FillContributors,
            FillSponsors,
            FillShelvesBooks,
            FillBookTocs,
            FillTopics,
            FillTopicTocs,
            UniqueRefCheckout
        ];
    }
}
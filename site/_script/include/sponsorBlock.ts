import { getAnimSpeed } from "global/computed";

class Sponsor
{
    element: HTMLElement;

    messageElem: Element;
    messages: string[];
    messageI = 0;

    constructor(rawSponsor, controller: SponsorBlockController)
    {
        this.messages = rawSponsor.messages;
        shuffleArray(this.messages);

        let elem = document.createElement('div');
            elem.innerHTML = SPONSOR_DATA.renderSponsor(rawSponsor);

        this.element = elem.firstChild as HTMLElement;

        this.messageElem = this.element.querySelector('.message');
        this.updateMessage();

        this.element.querySelector('.actions .next').addEventListener('click', () => controller.next());

        controller.inner.appendChild(this.element);
        controller.sponsorMap[rawSponsor.id] = this;
    }

    updateMessage()
    {
        this.messageElem.textContent = this.messages[(this.messageI++) % this.messages.length];
    }

    toggleCurrentClass(isCurrent: boolean)
    {
        this.element.classList.toggle('current', isCurrent);
    }
}

export class SponsorBlockController
{
    root:           HTMLElement;
    inner:          HTMLElement;
    sponsorMap:     { [id: string]: Sponsor } = {};

    tier: number;
    currentSponsor: Sponsor;
    currentI = 0;
    fakeI: number;

    resizeObs: ResizeObserver;

    static fakeStartIndex = 0;

    constructor(root: HTMLElement, tier: number)
    {
        this.tier = tier;
        this.fakeI = SponsorBlockController.fakeStartIndex++;

        this.root = root;

        this.inner = document.createElement('div');
        this.inner.classList.add('inner');
        this.root.appendChild(this.inner);

        this.resizeObs = new ResizeObserver(() => this.onResize());

        this.next();
    }

    getRaw()
    {
        let rawArr =    SPONSOR_DATA[`tier${this.tier}`];
        let raw =       rawArr[this.currentI % rawArr.length];

        return raw === 'fake' ? this.getFakeRaw() : raw;
    }

    getFakeRaw()
    {
        let rawFake = {...SPONSOR_DATA.fakeSponsors[this.fakeI % SPONSOR_DATA.fakeSponsors.length]};
            rawFake.isFake = true;
            rawFake.tier = this.tier;

        if (this.tier === 3)
            rawFake.id += '-tier3';
            
        if (this.tier < 3)
            delete rawFake.avatarVideo;

        return rawFake;
    }

    next()
    {
        let currentRaw = this.getRaw();

        this.currentI++;
        if (currentRaw.isFake)
            this.fakeI++;

        let nextRaw = this.getRaw();

        [currentRaw, nextRaw].forEach(raw =>
        {
            if (!(raw.id in this.sponsorMap))
                new Sponsor(raw, this);
        });

        let newCurrent = this.sponsorMap[currentRaw.id];
        this.setCurrentSponsor(newCurrent);
    }

    setCurrentSponsor(newCurrent: Sponsor)
    {
        if (this.currentSponsor)
        {
            this.resizeObs.unobserve(this.currentSponsor.element);
            this.currentSponsor.toggleCurrentClass(false);
        }

        this.currentSponsor = newCurrent;
        this.currentSponsor.updateMessage();
        this.currentSponsor.toggleCurrentClass(true);
        
        this.resizeObs.observe(this.currentSponsor.element);
        this.onResize();
    }

    onResize()
    {
        let height = this.currentSponsor.element.getBoundingClientRect().height;
        this.root.setAttribute('style', `height: ${height}px`);
    }
}

//
//
//

export class TopicSponsorData
{
    renderSponsor: (sponsor) => string;
    fakeSponsors: any[];
    tier3: any[];
    tier2: any[];
}

export let SPONSOR_DATA: TopicSponsorData;

export async function loadTopicSponsorData()
{
    let response = await fetch('/site/topicSponsorData.json');

    if (!response.ok)
        return false;

    let json = await response.json();
    
    let data = new TopicSponsorData;
        data.renderSponsor =    new Function('locals', json.templateFuncStr + ' return template(locals);') as any;
        data.fakeSponsors =     json.fakeSponsors;
        data.tier3 =            json.sponsors.tier3;
        data.tier2 =            json.sponsors.tier2;

    shuffleArray(data.fakeSponsors);
    shuffleArray(data.tier2);
    shuffleArray(data.tier3);

    data.tier3.push('fake');
    data.tier2.push('fake');

    SPONSOR_DATA = data;

    return true;
}

//
//
//

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
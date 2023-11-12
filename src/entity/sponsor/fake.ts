import { shuffle } from "lodash";
import { globSync } from "glob";
import path from "path";

import { DataSponsor } from "./data";
import { Sponsor, SponsorTheme } from "./global";
import { erudit } from "src/erudit";
import { exists, toForwardSlash } from "src/util/io";

type SponsorLike = Sponsor | Partial<Sponsor>;

let id = 0;
let link = 'https://boosty.to/omath';

function addFakeData(sponsor: SponsorLike, data: SponsorLike = {}): SponsorLike
{
    return {...sponsor, ...data, ...{ id: 'fake-' + id++, link: link }};
}

//
//
//

export function getFakeHighTierPool()
{
    let sponsors: Partial<Sponsor | DataSponsor>[] = [
        {
            id:     'euclid',
            name:   'Евклид',
            slogan: 'Написал самый первый учебник по математике!',
            emoji:  '📐',
            messages: [
                'Я писал учебники по математике, когда это еще не стало мейнстримом!',
                'Была бы такая штука в мое время, не стал бы писать свои «Начала»!',
                'Изложено интереснее и подробнее, чем у меня! Грех не поддержать!',
                'Ну тут-то с пятым постулатом разобрались? Сейчас посмотрим...',
                'Жаль у меня в 300 году до нашей эры такой штуки не было...'
            ]
        },
        {
            id:     'black-hole',
            name:   'Черная дыра',
            slogan: 'Сильнее меня притягивают только секреты математики!',
            emoji:  '⭕',
            messages: [
                'Я могу уничтожить всю информацию! Всю, кроме статей «Открытой математики»... они слишком хороши!',
                'Что сильнее моего притяжения? Только желание изучать математику на этом сайте!',
                'Чем дольше тут сидишь, тем сложнее оторваться!',
                'Моя гравитация не выпустит тебя отсюда, пока не поддержишь проект!'
            ]
        },
        {
            id:     'einstein',
            name:   'Альберт Эйнштейн',
            slogan: 'Только ситхи все возводят в абсолют!',
            emoji:  '🕒',
            messages: [
                'Все относительно, но этот проект абсолютно идеален!',
                'Быстрее скорости света только скорость, с которой я стал спонсором!',
                'Математика — наиболее совершенный способ водить самого себя за нос.',
                'Бог не играет в кости. А математики играют.'
            ]
        },
        {
            id:     'gagarin',
            name:   'Юрий Гагарин',
            slogan: 'Первый космонавт',
            emoji:  '🚀',
            messages: [
                'Поехали... изучать математику!',
                'Ну как вы там, потомки, Марс колонизировали? Математику изучаете? Тоже дело хорошее!'
            ]
        },
        {
            id:     'gorinich',
            name:   'Змей Горыныч',
            slogan: 'Уверен, что три головы втрое быстрее освоят математику',
            emoji:  '🔥',
            messages: [
                'Я никогда не повторяю! Никогда! Никогда!',
                'Сказки никто нынче не читает... Пора браться за математику!',
                'У меня три головы и каждая поддерживает «Открытую математику»!',
                'Слышал тут где-то обитает некий «квадратный трехчлен». Наконец-то! Достойный противник! Наша схватка будет легендарной!'
            ]
        },
        {
            id:     'newton',
            name:   'Исаак Ньютон',
            slogan: 'Терпеть не могу яблоки!',
            emoji:  '🍏',
            messages: [
                'Не все то яблоко, что падает.',
                'При изучении наук примеры полезнее правил. В статьях «Открытой математики» примеров предостаточно.',
                'Четвертый закон Ньютона — поддержавшие проект изучают математику в два раза быстрее!'
            ]
        },
        {
            id:     'gauss',
            name:   'Карл Фридрих Гаусс',
            slogan: 'Король математиков',
            emoji:  '👑',
            messages: [
                'Математика — царица всех наук.',
                'Занимательное чтиво... Правда, я все это знал еще в возрасте трех лет.',
                'Я запрещал своим детям заниматься наукой, ведь они никогда не превзошли бы моих результатов. Но с такими качественными статьями у них был бы шанс...',
                'Ну вот, теперь все знают, как быстро сложить числа от 1 до 100...'
            ]
        }
    ];

    let resultArr = shuffle([...sponsors]);

    return shuffle(resultArr.map(sponsor =>
        {
            let avatars = globSync(toForwardSlash( erudit.path.package('site', 'assets', 'fake-sponsors', `${sponsor.id}.{png,jpg,jpeg,webp}`)));

            if (avatars.length > 0)
                sponsor.avatar = '/site/assets/fake-sponsors/' + avatars[0].split(path.sep).pop();

            if (exists(erudit.path.package('site', 'assets', 'fake-sponsors', `${sponsor.id}.mp4`)))
                sponsor.avatarVideo = `/site/assets/fake-sponsors/${sponsor.id}.mp4`;

            return addFakeData(sponsor, {
                theme: SponsorTheme.setupTheme(SponsorTheme.getNextDefaultColor())
            }
        )}
    )) as Sponsor[];
}

export function getFakeTier1Sponsors()
{
    let sponsors: SponsorLike[] = [
        {
            name:   'Ваше имя',
            emoji:  '🫵'
        },
        {
            name:   'Первый Астронавтович',
            emoji:  '🚀'
        },
        {
            name:   'Прямой Угольникович',
            emoji:  '📐'
        },
        {
            name:   'Рыжик Барсикович',
            emoji:  '🐱'
        },
        {
            name:   'Василий «Ставлю все!»',
            emoji:  '🎲'
        },
        {
            name:   'Борис Бритва',
            emoji:  '🔫'
        },
        {
            name:   'Любитель опытов',
            emoji:  '🧪'
        },
        {
            name:   'Петр Плацебович',
            emoji:  '💊'
        },
        {
            name:   'Гаусс Интегралович',
            emoji:  '📈'
        }
    ];

    return sponsors.map(sponsor => addFakeData(sponsor, { tier: 1 })) as Sponsor[];
}
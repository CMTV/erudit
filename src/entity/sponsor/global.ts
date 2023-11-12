import Color from "color";
import { shuffle } from "lodash";

export class Sponsor
{
    id:             string;
    retired:        boolean;
    tier:           number;
    name:           string;
    link:           string;
    emoji:          string;
    avatar:         string;
    avatarVideo:    string;
    slogan:         string;
    messages:       string[];
    theme:          SponsorTheme;
}

export class SponsorTheme
{
    bg: string[];
    text: string[];
    border: string[];

    static colorI = 0;
    static defaultColors = [
        'ff2e2e',
        'ffb02e',
        'ffda2e',
        '6fff2e',
        '2effb7',
        '2ecaff',
        '2e48ff',
        'aa2eff',
        'ff2edf',
        'ff2e6e'
    ];

    static getNextDefaultColor()
    {
        let colorI = (this.colorI++) % this.defaultColors.length;

        if (colorI === 0)
        {
            let newColors;
            do
            {
                newColors = shuffle(this.defaultColors);
            }
            while (this.defaultColors.slice(-1) === newColors.slice(0));
            
            this.defaultColors = newColors;
        }

        return SponsorTheme.defaultColors[colorI];
    }

    static setupTheme(color: string)
    {
        if (!color.startsWith('#')) color = '#' + color;

        let cBase = Color(color);
    
        let theme = new SponsorTheme;
            theme.bg = [cBase.alpha(.2).hexa(), cBase.alpha(.1).hexa()];
            theme.text = SponsorTheme.makeLightDarkColors(cBase, 4);
            theme.border = SponsorTheme.makeLightDarkColors(cBase, 2);

        return theme;
    }

    static makeLightDarkColors(color, targetContrast)
    {
        return [
            this.makeContrast(color, Color('#ffffff'), targetContrast),
            this.makeContrast(color, Color('#000000'), targetContrast)
        ]
    }

    static makeContrast(color, bg, targetContrast)
    {
        while (color.contrast(bg) < targetContrast)
        {
            if (bg.isLight())
                color = color.darken(.05);
            else
                color = color.lighten(.05);
        }

        return color.hexa();
    }
}
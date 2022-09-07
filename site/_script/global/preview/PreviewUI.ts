import { BackButton, ExitButton, GotoButton, MiniButton, MiniButtonState } from "./button";
import Screen from "./Screen";
import View from "./View";

export default class PreviewUI
{
    onBackClick: () => any;
    onCloseComplete: () => any;

    private elements:
    {
        preview: HTMLElement;
        display: HTMLElement;
    }
    
    private heights:
    {
        maxPreview: number;
        footer:     number;
    }

    private buttons:
    {
        back: BackButton;
        goto: GotoButton;
        mini: MiniButton;
        exit: ExitButton;
    }

    private animSpeed: number;

    private closed: boolean;
    private collapsed: boolean;

    private screen: Screen;
    private screens: { [screenId: string]: Screen } = {};
    
    private stateScreens:
    {
        loading: Screen;
        error: Screen;
    }

    constructor()
    {
        // Elements
        {
            this.elements = <any>{};
            this.elements.preview = document.querySelector('#preview');
            this.elements.display = this.elements.preview.querySelector(':scope > .display');

            let closed = new Event('closed');

            this.elements.preview.dispatchEvent(closed);
        }
        
        // Heights
        {
            let computedStyle = getComputedStyle(this.elements.preview);

            this.heights = <any>{};
            this.heights.maxPreview = parseInt(computedStyle.getPropertyValue('--maxHeight'));
            this.heights.footer = parseInt(computedStyle.getPropertyValue('--footerHeight'));
        }

        // Buttons
        {
            let controls = document.querySelector('#preview > footer > .controls');

            this.buttons = <any>{};
            this.buttons.back = new BackButton(controls.querySelector('.back'));
            this.buttons.goto = new GotoButton(controls.querySelector('.goto'));
            this.buttons.mini = new MiniButton(controls.querySelector('.mini'));
            this.buttons.exit = new ExitButton(controls.querySelector('.exit'));
        }

        // Buttons Logic
        {
            this.buttons.mini.setState(MiniButtonState.Collapse);

            // Back
            {
                this.buttons.back.onClick = () => this.onBackClick && this.onBackClick();
            }

            // Mini
            {
                this.buttons.mini.onClick = () =>
                {
                    if (this.closed)
                        return;

                    this.setCollapsed(!this.collapsed);
                }
            }

            // Exit
            {
                let exitTimeout;
                this.buttons.exit.onClick = () =>
                {
                    clearTimeout(exitTimeout);
    
                    this.closed = true;

                    if (this.screen)
                        this.screen.setCurrent(false);

                    this.elements.preview.removeAttribute('style');
    
                    exitTimeout = setTimeout(() =>
                    {
                        if (!this.closed)
                            return;

                        this.clearScreen();
                        this.setButtons(false, null);
                        this.setCollapsed(false);
                        this.onCloseComplete && this.onCloseComplete();

                        this.elements.preview.dispatchEvent(new Event('close'));
                    }, this.animSpeed);
                }
            }  
        }

        // Animation Speed
        {
            let computedStyle = getComputedStyle(document.documentElement);
            this.animSpeed = parseFloat(computedStyle.getPropertyValue('--transitionSpeed')) * 1000;
        }

        // State Screens
        {
            this.stateScreens = <any>{};
            this.stateScreens.loading = new Screen('loading', <HTMLElement>this.elements.display.querySelector(':scope > .loading'));
            this.stateScreens.error = new Screen('error', <HTMLElement>this.elements.display.querySelector(':scope > .error'));
        }
    }

    getClosed()
    {
        return this.closed;
    }

    setButtons(canBack: boolean, source: string)
    {
        this.buttons.back.setDisabled(!canBack);
        this.buttons.goto.setSource(source);
    }

    exit()
    {
        this.buttons.exit.element.click();
    }

    //#region Screen
    //
    //

    setViewScreen(view: View)
    {
        this.setScreen(this.screens[view.url] || new Screen(view.url, view.content));
    }
    
    setLoadingScreen()
    {
        this.setStateScreen('loading');
    }

    setErrorScreen()
    {
        this.setStateScreen('error');
    }

    private setStateScreen(state: string)
    {
        let initHeight = 150;
        if (this.screen)
            initHeight = Math.max(initHeight, this.elements.display.clientHeight);
        
        let stateScreen = this.stateScreens[state] as Screen;
            stateScreen.inner.setAttribute('style', 'height: ' + initHeight + 'px;');

        this.setScreen(stateScreen);
    }

    private setScreen(screen: Screen)
    {
        this.elements.preview.dispatchEvent(new Event('screen'));

        //

        this.closed = false;
        this.setCollapsed(false);

        //

        if (this.screen)
        {
            if (screen.id === this.screen.id)
            {
                this.screen.setCurrent(true);
                return;
            }

            this.screen.setCurrent(false);
        }

        if (!(screen.id in this.screens))
        {
            this.screens[screen.id] = screen;
            this.elements.display.appendChild(screen.element);
            screen.onHeightChange = (height) => this.setHeight(height);
        }

        this.screen = this.screens[screen.id];

        // Wrapping with 'setTimeout' to enable CSS transitions
        setTimeout(() => this.screen.setCurrent(true), 0);

        this.setHeight(this.screen.getHeight());
    }

    private clearScreen()
    {
        if (this.screen)
        {
            this.screen.setCurrent(false);
            this.screen = null;
        }

        Object.values(this.screens).forEach(screen =>
        {
            if (screen == this.stateScreens.loading || screen == this.stateScreens.error)
                return;

            this.elements.display.removeChild(screen.element);
        });

        this.screens = {...this.stateScreens};
    }

    //
    //
    //#endregion

    private setHeight(height: number, isPreviewHeight = false)
    {
        if (!isPreviewHeight)
            height += this.heights.footer;

        height = Math.min(height, this.heights.maxPreview);

        this.elements.preview.setAttribute('style', 'height: ' + height + 'px;');
    }

    private setCollapsed(collapsed: boolean)
    {
        this.collapsed = collapsed;

        if (collapsed)
        {
            this.setHeight(50, true);
            this.buttons.mini.setState(MiniButtonState.Expand);
        }
        else
        {
            if (this.screen)
                if (!this.closed)
                    this.setHeight(this.screen.getHeight());
            
            this.buttons.mini.setState(MiniButtonState.Collapse);
        }
    }
}
export function getAnimSpeed()
{
    let computedStyle = getComputedStyle(document.documentElement);
    return parseFloat(computedStyle.getPropertyValue('--transitionSpeed')) * 1000;
}
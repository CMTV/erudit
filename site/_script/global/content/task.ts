export function initTasksIn(element: Element)
{
    element.querySelectorAll('.task').forEach(task =>
    {
        task.querySelectorAll(':scope > header > .controls > button').forEach(button =>
        {
            button.addEventListener('click', () =>
            {
                task.toggleAttribute(`data-${button.getAttribute('data-section')}-open`);
            });
        });
    });
}
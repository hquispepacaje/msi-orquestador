const clientProps = {
    max_completion_tokens: 13107,
    temperature: 1,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
};

const getCompletionWithTools = (azureProps, messages, tools) => azureProps.client.chat.completions.create({
    modelName: azureProps?.modelName,
    messages,
    tools,
    ...clientProps,
});

const getCompletion = (azureProps, messages) => azureProps.client.chat.completions.create({
    modelName: azureProps?.modelName,
    messages,
    ...clientProps,
});

module.exports = { getCompletionWithTools, getCompletion };
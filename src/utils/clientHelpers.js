const clientProps = {
    modelName: process.env.AZURE_OPENAI_DEPLOYMENT,
    max_completion_tokens: 13107,
    temperature: 1,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
};

const getCompletionWithTools = (client, messages, tools) => client.chat.completions.create({
    messages,
    tools,
    ...clientProps,
});

const getCompletion = (client, messages) => client.chat.completions.create({
    messages,
    ...clientProps,
});

module.exports = { getCompletionWithTools, getCompletion };
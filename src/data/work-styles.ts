/**
 * ITD Work Styles Model questionnaire — migrated verbatim from the WordPress
 * Quiz & Survey Master data (quiz id 4). 40 statements, 10 per style; each
 * "Agree" scores one point for that style, so every style scores 0–10.
 */
export type WorkStyle = 'Conceptual' | 'Social' | 'Analytical' | 'Direct';

export const workStyles: WorkStyle[] = ['Conceptual', 'Social', 'Analytical', 'Direct'];

export const statements: { id: string; text: string; style: WorkStyle }[] = [
  {
    "id": "85",
    "text": "You get impatient if a meeting goes off the agenda.",
    "style": "Direct"
  },
  {
    "id": "87",
    "text": "You need to be accurate and precise.",
    "style": "Analytical"
  },
  {
    "id": "88",
    "text": "You enjoy making good friends in the office.",
    "style": "Social"
  },
  {
    "id": "89",
    "text": "You want meetings to start on time and finish on time.",
    "style": "Direct"
  },
  {
    "id": "90",
    "text": "You like to give tasks the time they deserve and to reflect on the result.",
    "style": "Analytical"
  },
  {
    "id": "91",
    "text": "Your enthusiasm for a piece of work can decrease over time.",
    "style": "Conceptual"
  },
  {
    "id": "92",
    "text": "You are a good team player and supportive of others.",
    "style": "Social"
  },
  {
    "id": "93",
    "text": "You prefer to be given clear and concise instructions.",
    "style": "Direct"
  },
  {
    "id": "94",
    "text": "You like to gather all the information before making a decision.",
    "style": "Analytical"
  },
  {
    "id": "95",
    "text": "You like to tick things off your To Do list and get things done.",
    "style": "Direct"
  },
  {
    "id": "96",
    "text": "Your are enthusiastic with work and with people.",
    "style": "Conceptual"
  },
  {
    "id": "97",
    "text": "You don’t like other people to rush you.",
    "style": "Analytical"
  },
  {
    "id": "98",
    "text": "You make decisions quickly and easily.",
    "style": "Direct"
  },
  {
    "id": "99",
    "text": "You like working in teams, or with colleagues.",
    "style": "Social"
  },
  {
    "id": "100",
    "text": "You do not like confrontation and will often avoid it.",
    "style": "Social"
  },
  {
    "id": "101",
    "text": "You sometimes start a new task before finishing the last one.",
    "style": "Conceptual"
  },
  {
    "id": "102",
    "text": "When briefed on a new task, you like to get the big picture with not too much detail.",
    "style": "Conceptual"
  },
  {
    "id": "103",
    "text": "When you get a new task you start it quickly.",
    "style": "Direct"
  },
  {
    "id": "104",
    "text": "You prefer to reflect and consider a point before giving your opinion.",
    "style": "Analytical"
  },
  {
    "id": "105",
    "text": "You prefer sending and receiving emails which are short and to the point.",
    "style": "Direct"
  },
  {
    "id": "106",
    "text": "You are good at seeing the implications of a possible action.",
    "style": "Conceptual"
  },
  {
    "id": "107",
    "text": "You like to get to know new people.",
    "style": "Social"
  },
  {
    "id": "108",
    "text": "You enjoy getting new tasks or projects.",
    "style": "Conceptual"
  },
  {
    "id": "109",
    "text": "You particularly admire people with proven knowledge.",
    "style": "Analytical"
  },
  {
    "id": "110",
    "text": "You are driven to achieve objectives.",
    "style": "Direct"
  },
  {
    "id": "111",
    "text": "To help others, you sometimes say yes to new work even though you are already very busy.",
    "style": "Social"
  },
  {
    "id": "112",
    "text": "You can be creative about your work and like to solve challenges.",
    "style": "Conceptual"
  },
  {
    "id": "113",
    "text": "You can be pedantic with grammar in documents and emails.",
    "style": "Analytical"
  },
  {
    "id": "114",
    "text": "You don’t like people to miss deadlines.",
    "style": "Direct"
  },
  {
    "id": "115",
    "text": "If it means the work is done correctly, you don't mind putting in extra effort.",
    "style": "Analytical"
  },
  {
    "id": "116",
    "text": "You like to check and re-check work for accuracy.",
    "style": "Analytical"
  },
  {
    "id": "117",
    "text": "Sometimes you try to find new ways of doing things which already work very well.",
    "style": "Conceptual"
  },
  {
    "id": "118",
    "text": "When you’re busy on work you don’t want to chat.",
    "style": "Direct"
  },
  {
    "id": "119",
    "text": "You notice when something is not quite right with a colleague.",
    "style": "Social"
  },
  {
    "id": "120",
    "text": "When starting meetings you first like to have a catch up chat.",
    "style": "Social"
  },
  {
    "id": "121",
    "text": "Whilst you have ideas, you do not always think them through in detail.",
    "style": "Conceptual"
  },
  {
    "id": "122",
    "text": "You are good at noticing people’s feelings.",
    "style": "Social"
  },
  {
    "id": "123",
    "text": "If somebody is angry, your first thought can be, ‘what have I done wrong?'",
    "style": "Social"
  },
  {
    "id": "124",
    "text": "Sometimes you change something just for the sake of change.",
    "style": "Conceptual"
  },
  {
    "id": "125",
    "text": "You can find it a challenge to delegate when people don’t have your standards.",
    "style": "Analytical"
  }
];

/** Shown above the scores on the results panel. */
export const resultsIntro: string[] = [
  "Now you have completed the ITD Work Styles Questionnaire you will probably want to understand what it means.",
  "You will have scored from zero to ten for each of the four styles; Conceptual, Social, Analytical & Direct.",
  "Whichever is your highest score would indicate that this style dominates the way you approach your work generally, but not necessarily in all situations. The other scores indicate your preference for doing things in different situations. So you could be quite social in how you interact with people but more analytical in how you approach emails.",
  "The skill is identifying which style dominates your approach when you are doing different sorts of work; communication, meetings, writing emails, drafting documents, working in a team etc.",
  "Take a look at your high score, read the descriptors below and reflect on how you go about your work, especially in the different types of work you do.",
  "We have to always bear in mind that we are complex beings, we don’t fit into boxes and no tool like this will be able to explain all situations. Having said that we find that this is a useful tool to explain our own behaviour and the behaviour of others.",
  "There is no judgement within this model. No style is better than another. There is room for all styles and behaviours. Having said that, it is up to you to decide whether you are happy for a behaviour, or a style, to drive how you approach a part of your work. It may be possible for you to moderate, or control a behaviour to produce a different outcome.",
  "The first step is to reflect and understand which part of your work style is driving behaviours when you do different types of work."
];

export const styleDescriptions: Record<WorkStyle, { overview: string; strengths: string[]; weaknesses: string[]; communication: string[] }> = {
  "Conceptual": {
    "overview": "The Conceptual enjoys change. They like variety in their work with new tasks and projects. This means they tend to struggle with routine and processes. The Conceptual enjoys working with colleagues. Collaboration and team working come naturally. They see the big picture and strategy. They like to see the overview and the overall direction. Because of this view, they can be excellent problem solvers.",
    "strengths": [
      "Can be very good at adapting to change.",
      "Good problem solvers.",
      "See the strategic view and connections between events or actions.",
      "Enthusiastic and energising.",
      "Sees the big picture easily"
    ],
    "weaknesses": [
      "May change their mind too readily.",
      "May not see the detailed aspects of a new choice.",
      "Could be over enthusiastic.",
      "Can be distracted by emails or new things.",
      "Start with enthusiasm but may not finish a task or project."
    ],
    "communication": [
      "They tend to communicate with energy, especially with new tasks or projects.",
      "Enjoy talking with others who have interest in their ideas, or change generally.",
      "Enjoys giving time to new ideas or change."
    ]
  },
  "Social": {
    "overview": "The Social person is people centred. Tend to be very helpful and accommodating. Enjoys working people and may well choose their organisation and team because of the people. Typically avoids conflict as they want everyone to get on. They are easy to be with and conversation with new people comes very easy to them. Kindness and a drive for everyone to be happy is central to their style. They understand the implications of actions on people and is sensitive to everyone.",
    "strengths": [
      "Helpful to colleagues and clients alike.",
      "Easy to talk with.",
      "Interested in people and what they have to say.",
      "Supporter of the team and everyone in it; wants everyone to be happy.",
      "Notices and understands what people are feeling."
    ],
    "weaknesses": [
      "May say yes too readily.",
      "Easily distracted by other people.",
      "May not be assertive enough with more direct people.",
      "Tends to avoid conflict.",
      "If there is anger around they may first think that they in some way are the cause of it."
    ],
    "communication": [
      "Easy to communicate with and always friendly.",
      "Interested in others and their opinions.",
      "May not say what they really think if it might cause offence.",
      "Likes to have a catch up chat before a meeting begins.",
      "Emails may be too wordy, but they will always reply."
    ]
  },
  "Analytical": {
    "overview": "Driven by accuracy and quality of work. Respects other people who have knowledge, qualifications or authoritative roles. Really focusses on the work and quality of performance. Gives a very considered opinion and can be relied on to usually base thoughts on facts not feelings. Tend not to rush work or decisions, they are deliberate and cautious. Typically more reserved, Analyticals can be very conversational but this is likely to be more with established colleagues and friends, about subjects they have thought through.",
    "strengths": [
      "Produces accurate work.",
      "Excellent at making sure things are up to the correct standard required.",
      "Not only good at the details but at checking the quality of work.",
      "Takes the time needed to do a good job.",
      "Good at following a set procedure."
    ],
    "weaknesses": [
      "Can be slow in explaining things and may follow side issues in great detail.",
      "May take a long time to make decisions because they want to see all the data.",
      "May often work late because accuracy is more important than any other factor.",
      "Can be seen as paying too much attention to the detail and not on the overall impact.",
      "May not see the big picture."
    ],
    "communication": [
      "Can be relied on to give a complete answer with all the details.",
      "They tend to give lengthy explanations and answers. Communication needs to be backed up by evidence or facts.",
      "Meetings can go over time.",
      "Emails can be very lengthy, detailed and accurate. There may be too much detail.",
      "Prefer to talk about substantial issues rather than a chat."
    ]
  },
  "Direct": {
    "overview": "The Direct person is often the easiest to identify. They get to meetings on time and expect them to start immediately. They get straight to the point and expect others to do so as well. They are driven by objectives are single minded and decisive. Whilst they can be seen to be abrupt, you know where you stand with them. Whatever their goal is, this is their focus. They are as critical with themselves as they are of others. But equally full of praise for those who help them to achieve their goal.",
    "strengths": [
      "Goal orientated.",
      "Quick to make decisions.",
      "Clear communicators.",
      "Determined"
    ],
    "weaknesses": [
      "May not give enough detail.",
      "Can be abrupt.",
      "Misses the human touch.",
      "Maybe too quick to decide and start new tasks without enough planning.",
      "May not listen to quieter people, who may have the correct answer."
    ],
    "communication": [
      "They tend to get straight to the point, clear and concise.",
      "They might not remember details, which to them are unimportant.",
      "Emails tend to be focussed and make a request, or question very clearly.",
      "Not interested in chat when they are in work mode.",
      "Can be quite self-interested.",
      "They say what they think and expect others to."
    ]
  }
};

export const closingNote =
  'You can use the ITD Work Styles Model to reflect on how you go about your work; how you self organise; how you delegate; how you instruct; how you draft emails; how you reply to emails; how you lead; how you follow.';

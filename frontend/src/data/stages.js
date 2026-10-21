/**
 * CallPilot — Official 8-Stage Cold-Call Structure
 *
 * This file is the single source of truth for stage definitions.
 * Update stage content here without changing application logic.
 *
 * Stages informed by standard B2B cold-call methodology.
 * Update with official assignment content when materials become available.
 */

export const STAGES = [
    {
        id: 1,
        name: 'Opening & Introduction',
        shortName: 'Opening',
        purpose:
            'Establish who you are and your company within the first 10–15 seconds. The prospect decides whether to engage in those opening moments.',
        callerGoal:
            'State your name and company clearly. Sound confident and unhurried. Do not launch into a pitch before gaining permission to speak.',
        typicalProspectResponses: [
            '"Who is this?"',
            '"How did you get this number?"',
            '"Is this a sales call?"',
            '"I\'m in a meeting right now."',
            '"I only have a minute."',
        ],
        suggestedTalkingPoints: [
            'Hi [prospect name], this is [your name] from [company].',
            'Quick note — this is a cold call. I\'ll be upfront with you.',
            'I have a specific reason I reached out to you today, can I share it in 30 seconds?',
        ],
        objections: [
            {
                objection: 'We already use someone for that.',
                response:
                    'That\'s exactly why I\'m calling. A lot of the people I speak with already have a solution — I just want to offer a different angle. Can I have 30 seconds?',
            },
            {
                objection: 'I\'m not interested.',
                response:
                    'Completely understand. Can I ask — out of curiosity — what would make something like this worth 30 seconds of your time?',
            },
        ],
        availableResults: [
            { value: 'progressed', label: 'Progressed — prospect agreed to continue' },
            { value: 'permission_granted', label: 'Permission granted — they said go ahead' },
            { value: 'objection_raised', label: 'Objection raised' },
            { value: 'not_interested', label: 'Not interested — ended here' },
            { value: 'unavailable', label: 'Unavailable / voicemail' },
            { value: 'callback_requested', label: 'Callback requested' },
        ],
        defaultResult: 'progressed',
        tipForCaller:
            'Be conversational, not scripted. A warm, calm tone creates more trust than rehearsed lines.',
    },
    {
        id: 2,
        name: 'Permission & Pattern Interrupt',
        shortName: 'Permission',
        purpose:
            'Obtain micro-permission to continue. Pattern interrupts break the "I don\'t take cold calls" reflex by being unexpectedly transparent.',
        callerGoal:
            'Ask permission to share your reason for calling. Be brief and genuine. Do not disguise a sales call as something else.',
        typicalProspectResponses: [
            '"Sure, what\'s this about?"',
            '"Go ahead, but make it quick."',
            '"What is this regarding?"',
            '"I\'m listening."',
            '"I usually don\'t take cold calls, but go ahead."',
        ],
        suggestedTalkingPoints: [
            'I\'ll be honest — this is a cold call and I know you probably weren\'t expecting it.',
            'Can I tell you specifically why I picked up the phone to call you today?',
            'I only need 90 seconds. If it doesn\'t resonate, you can hang up and I won\'t take it personally.',
        ],
        objections: [
            {
                objection: 'Just send me an email.',
                response:
                    'I will — and I\'d rather have 60 seconds with you now so the email has some context. Would that be fair?',
            },
        ],
        availableResults: [
            { value: 'permission_granted', label: 'Permission granted' },
            { value: 'progressed', label: 'Progressed naturally to reason for calling' },
            { value: 'objection_raised', label: 'Objection raised' },
            { value: 'not_interested', label: 'Not interested' },
            { value: 'email_requested', label: 'Email requested — follow up in email' },
        ],
        defaultResult: 'permission_granted',
        tipForCaller:
            'Silence after asking permission often means they\'re thinking. Do not fill the pause — let them respond.',
    },
    {
        id: 3,
        name: 'Reason for Calling',
        shortName: 'Reason',
        purpose:
            'Deliver a concise, prospect-centric hook that explains exactly why you called this specific person at this specific company.',
        callerGoal:
            'State the business problem you solve without launching into product features. Make it relevant to their world, not yours.',
        typicalProspectResponses: [
            '"Interesting — what exactly do you do?"',
            '"We\'ve looked at solutions like that before."',
            '"Tell me more."',
            '"That\'s not really a challenge for us."',
            '"How is that relevant to my role?"',
        ],
        suggestedTalkingPoints: [
            'The reason I\'m calling is that we typically work with [role/industry] teams who are struggling with [specific pain point].',
            'I reached out because I noticed [specific trigger — e.g. recent growth / news].',
            'Other [industry] leaders I speak with often tell me that [main challenge]. Does that resonate?',
        ],
        objections: [
            {
                objection: 'We don\'t have that problem.',
                response:
                    'That\'s good to hear. Can I ask — what does [related process] look like for your team right now? Just to understand your context.',
            },
            {
                objection: 'We already have a solution.',
                response:
                    'Great — I\'d still love to understand how you\'re set up today. We often find we complement existing tools rather than replace them.',
            },
        ],
        availableResults: [
            { value: 'progressed', label: 'Progressed — interest shown' },
            { value: 'engaged', label: 'Highly engaged — asking questions' },
            { value: 'mild_interest', label: 'Mild interest' },
            { value: 'objection_raised', label: 'Objection raised' },
            { value: 'not_relevant', label: 'Not relevant to them' },
            { value: 'not_interested', label: 'Not interested' },
        ],
        defaultResult: 'progressed',
        tipForCaller:
            'One sentence on the pain, one sentence on who you work with. Resist the urge to mention your product by name this early.',
    },
    {
        id: 4,
        name: 'Discovery & Qualification',
        shortName: 'Discovery',
        purpose:
            'Understand the prospect\'s current situation, challenges, goals, and decision-making authority. This is the most important stage for long-term success.',
        callerGoal:
            'Ask open-ended questions. Listen actively. Qualify whether this prospect is a genuine fit before investing more time.',
        typicalProspectResponses: [
            '"We already have a process, but it takes too much time."',
            '"Our main challenge is getting teams aligned."',
            '"We\'re actually looking at a few options right now."',
            '"I\'d need to loop in my manager on anything like this."',
            '"Honestly we haven\'t thought about it much."',
            '"Budget is a concern at the moment."',
        ],
        suggestedTalkingPoints: [
            'What does your current process for [X] look like?',
            'Where do you feel the most friction day to day?',
            'What\'s the impact when that goes wrong?',
            'Who else is involved in decisions like this?',
            'Is this something on your radar for the near future?',
        ],
        objections: [
            {
                objection: 'We don\'t have budget right now.',
                response:
                    'Understood. Is this a timing issue, or is it more that the value hasn\'t been clear enough to justify the spend?',
            },
            {
                objection: 'I\'m not the right person.',
                response:
                    'Appreciate you being direct — who would be the best person to continue this conversation with?',
            },
        ],
        availableResults: [
            { value: 'progressed', label: 'Progressed — good fit identified' },
            { value: 'qualified', label: 'Fully qualified — clear need, authority, timeline' },
            { value: 'partially_qualified', label: 'Partially qualified — needs follow-up' },
            { value: 'objection_raised', label: 'Objection raised' },
            { value: 'not_a_fit', label: 'Not a fit — disqualified' },
            { value: 'wrong_contact', label: 'Wrong contact — referred elsewhere' },
            { value: 'follow_up_required', label: 'Follow-up required' },
        ],
        defaultResult: 'progressed',
        tipForCaller:
            'Use the BANT framework loosely: Budget, Authority, Need, Timeline. You don\'t need all four confirmed — but note what you learn.',
    },
    {
        id: 5,
        name: 'Problem Agitation',
        shortName: 'Agitation',
        purpose:
            'Help the prospect feel the cost of the problem they described. Connect their pain to business impact, making the status quo harder to defend.',
        callerGoal:
            'Deepen the pain discovered in Stage 4. Ask about consequences, not just symptoms. Do not manufacture urgency — use the prospect\'s own words.',
        typicalProspectResponses: [
            '"Yeah, it does cost us a lot of time."',
            '"We\'ve had to bring in extra staff to handle it."',
            '"It\'s definitely something that\'s been on the backburner."',
            '"Our team is frustrated with the current setup."',
            '"We lose clients over it sometimes."',
        ],
        suggestedTalkingPoints: [
            'When that happens, what\'s the knock-on effect for the team?',
            'How long has this been going on?',
            'Have you estimated what it costs you in time or revenue?',
            'What happens if nothing changes in the next six months?',
        ],
        objections: [
            {
                objection: 'It\'s not that big a deal.',
                response:
                    'That\'s fair — many teams learn to live with it. I\'m just curious: if you could fix it painlessly, would you?',
            },
        ],
        availableResults: [
            { value: 'progressed', label: 'Progressed — pain acknowledged and amplified' },
            { value: 'high_pain', label: 'High pain — strong motivation to change' },
            { value: 'low_pain', label: 'Low pain — unlikely to act soon' },
            { value: 'objection_raised', label: 'Objection raised' },
            { value: 'not_interested', label: 'Not interested — pain not felt' },
        ],
        defaultResult: 'progressed',
        tipForCaller:
            'Mirror the prospect\'s exact words back to them. "You mentioned it costs extra staff hours — can you tell me more about that?" feels collaborative, not pushy.',
    },
    {
        id: 6,
        name: 'Solution Presentation',
        shortName: 'Solution',
        purpose:
            'Connect your solution directly to the specific pain the prospect named. Lead with outcomes and relevance, not feature lists.',
        callerGoal:
            'Present your value proposition briefly and specifically. Use their words. Offer a next step rather than a full demo on this call.',
        typicalProspectResponses: [
            '"How does that actually work?"',
            '"We\'ve tried something similar before."',
            '"What makes you different from [competitor]?"',
            '"That sounds interesting — can you send information?"',
            '"What does it cost?"',
        ],
        suggestedTalkingPoints: [
            'Based on what you\'ve told me about [pain point], here\'s how we typically address that…',
            'The companies we work with see [specific outcome — e.g. 30% time reduction] within [timeframe].',
            'Rather than going through everything now, would a short demo make sense?',
        ],
        objections: [
            {
                objection: 'We tried something like that and it didn\'t work.',
                response:
                    'I hear that a lot. Can I ask what happened? That usually helps me understand whether what we do would be different for you.',
            },
            {
                objection: 'What\'s the price?',
                response:
                    'Happy to discuss pricing — it depends on a few factors. Can we first confirm it\'s a fit, and then I can give you a precise number?',
            },
        ],
        availableResults: [
            { value: 'progressed', label: 'Progressed — positive reception' },
            { value: 'interested', label: 'Interested — wants to see more' },
            { value: 'demo_requested', label: 'Demo requested' },
            { value: 'info_requested', label: 'Information requested — follow up' },
            { value: 'objection_raised', label: 'Objection raised' },
            { value: 'not_interested', label: 'Not interested in the solution' },
        ],
        defaultResult: 'progressed',
        tipForCaller:
            'Keep this under 60 seconds. The goal is a meeting, not a sale. Offer specificity, not comprehensiveness.',
    },
    {
        id: 7,
        name: 'Objection Handling',
        shortName: 'Objections',
        purpose:
            'Address concerns that prevent the prospect from agreeing to a next step. Most objections are hesitations, not final decisions.',
        callerGoal:
            'Name the objection clearly, validate it, and respond with evidence or a reframe. Do not argue. Do not ignore.',
        typicalProspectResponses: [
            '"We don\'t have the budget for this."',
            '"Now isn\'t a good time."',
            '"We need to evaluate other options first."',
            '"I need to discuss this with my team."',
            '"We\'re happy with what we have."',
            '"Send me something to read first."',
        ],
        suggestedTalkingPoints: [
            'That\'s a fair concern. Can I ask what specifically is driving that?',
            'A lot of people say that initially. Here\'s what they usually tell me after…',
            'I understand — when do you think would be a better time to revisit?',
            'What would need to be true for this to be a priority?',
        ],
        objections: [
            {
                objection: 'Just send me an email and I\'ll look at it later.',
                response:
                    'I will send one. Before I do — rather than a generic email, is there one specific thing I should make sure to address?',
            },
            {
                objection: 'We need to involve procurement.',
                response:
                    'Of course. Who\'s the right person to start that conversation with, and would it help to have me on that call?',
            },
            {
                objection: 'We don\'t have budget until next year.',
                response:
                    'That\'s helpful to know. If we got the right conversation started now, you\'d be positioned to act when the budget opens. Does that make sense to explore?',
            },
        ],
        availableResults: [
            { value: 'progressed', label: 'Objection resolved — progressed' },
            { value: 'partially_resolved', label: 'Partially resolved — hesitation remains' },
            { value: 'follow_up_required', label: 'Follow-up required after further consideration' },
            { value: 'objection_unresolved', label: 'Objection unresolved — call may end' },
            { value: 'not_interested', label: 'Not interested — firm no' },
            { value: 'budget_timing', label: 'Budget / timing issue — nurture' },
        ],
        defaultResult: 'progressed',
        tipForCaller:
            'Never fight an objection. Agree, clarify, and redirect. "I hear you — and that\'s exactly why…" is more effective than "But…".',
    },
    {
        id: 8,
        name: 'Close & Next Steps',
        shortName: 'Close',
        purpose:
            'Secure a specific, time-bound commitment for what happens next. A good cold call ends with a clear action, not vague follow-up.',
        callerGoal:
            'Propose a concrete next step. Make it easy to say yes. Confirm a specific date and time if possible.',
        typicalProspectResponses: [
            '"Sure, that works for me."',
            '"Let me check my calendar."',
            '"Send the invite and I\'ll confirm."',
            '"Can we do next week instead?"',
            '"I\'m not ready to commit to a meeting yet."',
            '"Just send me the information first."',
        ],
        suggestedTalkingPoints: [
            'Based on our conversation, I\'d love to set up 30 minutes to walk you through a tailored demo.',
            'Does [specific day and time] work, or is [alternative] better?',
            'I\'ll send you a calendar invite right now — does [email] reach you?',
            'Even if it\'s just exploratory, worth 30 minutes to see if there\'s a fit?',
        ],
        objections: [
            {
                objection: 'I\'m too busy right now.',
                response:
                    'Totally understand. What does your calendar look like in two weeks? I can work around you.',
            },
            {
                objection: 'We\'re not ready for that yet.',
                response:
                    'Fair. Can we schedule something tentative and you can always cancel if things change?',
            },
        ],
        availableResults: [
            { value: 'meeting_booked', label: 'Meeting / demo booked — strong outcome' },
            { value: 'follow_up_scheduled', label: 'Follow-up call scheduled' },
            { value: 'next_step_agreed', label: 'Next step agreed (email, referral, etc.)' },
            { value: 'prospect_to_confirm', label: 'Prospect to confirm — needs chasing' },
            { value: 'nurture', label: 'Long-term nurture — not ready now' },
            { value: 'not_interested', label: 'Not interested — no next step' },
        ],
        defaultResult: 'meeting_booked',
        tipForCaller:
            'Always offer two specific options rather than an open question ("Tuesday or Thursday?"). It\'s easier for prospects to choose than to decide.',
    },
]

export const FINAL_OUTCOMES = [
    { value: 'meeting_booked', label: '✅ Meeting / Demo Booked' },
    { value: 'follow_up_scheduled', label: '📅 Follow-up Call Scheduled' },
    { value: 'next_step_agreed', label: '🤝 Next Step Agreed' },
    { value: 'info_sent', label: '📧 Information Sent — Awaiting Response' },
    { value: 'not_interested', label: '🚫 Not Interested' },
    { value: 'no_response', label: '📵 No Response / Voicemail' },
    { value: 'wrong_contact', label: '🔀 Wrong Contact — Referred Elsewhere' },
    { value: 'nurture', label: '⏳ Long-term Nurture' },
    { value: 'other', label: '📝 Other Outcome' },
]

export const CALL_STATUSES = {
    ACTIVE: 'active',
    COMPLETED: 'completed',
}

export const getStageById = (id) => STAGES.find((s) => s.id === id) || STAGES[0]

export const TOTAL_STAGES = STAGES.length

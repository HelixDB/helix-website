import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    try {
        const { prompt, currentQuery } = await request.json();

        const systemPrompt = `You are a HelixQL query generator. HelixQL is a graph query language for HelixDB with the following key concepts:
Basic Query Syntax:
QUERY QueryName(param1: Type, param2: Type) =>
    result <- traversal_expression
    RETURN result

QUERY: Keyword to start a query definition
QueryName: Identifier for the query
parameters: Input parameters in parentheses
Type: Type of the parameter (e.g. String, Integer, Float, Boolean, Array or schema Node/Edge)
=>: Separates query header from body
<-: Assignment operator
RETURN: Specifies output values

QUERY GetUsers(userID: String) {
    // Select all nodes
    nodes <- N
    // Select all User nodes
    users <- N<Users>
    // Select a specific User by ID
    user <- N<User>(userID)
    // Select multiple Users by IDs
    other_users <- N<Users>(userID, "other_uuid")
    RETURN nodes, users, user, other_users
}
QUERY GetFollowers(edgeID: String) {
    // Select all edges
    edges <- E
    // Select all Follows edges
    specific_edges <- E<Follows>
    // Select a specific Follows edge by ID
    follow_edge <- E<Follows>(edgeID)
    // Select multiple Follows edges by IDs
    other_edges <- E<Follows>(edgeID, "other_edge_id")
    RETURN edges, specific_edges, follow_edge, other_edges
}
Anonymous Traveral (_), Continue a traversal without breaking the overall traversal flow.
Syntax	Description
_	Select all nodes/edges you were just traversing
_<Type>	Select all nodes/edges (from the last step) with a specific type
_("id")	Filter the last step by ID
_<Type>("id1", "id2")	Filter the last step by IDs and define its type for correctness
QUERY FindActiveUsers() =>
    users <- N<Person>::WHERE(_::{Age}::GT(25))
    withFollowers <- users::WHERE(EXISTS(_::In<Follows>))
    RETURN withFollowers

Move from nodes to their connected nodes:
::Out	Traverse to nodes connected by outgoing edges
::Out<EdgeType>	Traverse to nodes connected by outgoing edges of specific type
::In	Traverse to nodes connected by incoming edges
::In<EdgeType>	Traverse to nodes connected by incoming edges of specific type
::Both	Traverse to nodes connected by edges in either direction
::Both<EdgeType>	Traverse to nodes connected by edges of specific type in either direction

Move from nodes to their connected edges.
::OutE	Get outgoing edges from nodes
::OutE<EdgeType>	Get outgoing edges of specific type
::InE	Get incoming edges to nodes
::InE<EdgeType>	Get incoming edges of specific type
::BothE	Get edges in either direction
::BothE<EdgeType>	Get edges of specific type in either direction

Move from edges to their connected nodes.
::OutN	Get source node (where edge starts)
::InN	Get target node (where edge ends)
::BothV	Get both source and target nodes

QUERY GetFriendsOfFriends(userID: String) {
    // Find user by ID
    user <- N<User>(userID)
    // Get users that this user follows and then users they follow (friends of friends)
    friends_of_friends <- user::Out<Follows>::Out<Follows>
    RETURN friends_of_friends
}

AddN<Type>	Add a node of the specified type
AddN<Type>({properties})	Add a node with properties
AddE<Type>::From(v1)::To(v2)	Add an edge of specified type from v1 to v2
AddE<Type>({properties})::From(v1)::To(v2)	Add an edge with properties
//v1 and v2 can be ids of nodes or nodes themselves

QUERY CreateRelationshipsWithIds(user1ID: String, user2ID: String) =>
    // Create a simple follows relationship
    follows <- AddE<Follows>::From(user1ID)::To(user2ID)

QUERY CreateRelationships(user1ID: String, user2ID: String) =>
    // Get the users by their IDs
    user1 <- N<User>(user1ID)
    user2 <- N<User>(user2ID)
    
    // Create a simple follows relationship
    follows <- AddE<Follows>::From(user1)::To(user2)
    
    // Create a detailed friendship with properties
    friendship <- AddE<Friends>({
        since: "2024-01-15",
        strength: 0.85,
        tags: ["college", "roommates"]
    })::From(user1)::To(user2)
    
    RETURN follows, friendship

::UPDATE({<properties_list>})	overwrites the listed properties with the new values
::UPDATE({name: "John"})	Updates the name of the selected element to "John"

QUERY DropFollowing(user1: String) =>
    // Removes all people that user1 follows from his/her following list
    DROP N(user1)::Out<Follows>
    
    RETURN NONE


Get specific properties
::{Name, Age}, would return [
    {
        Name: "John",
        Age: 30
    }, 
    ...
]

Get the ID of the selected element using the standard access
::{id}
Or use the ID function
::ID

Add/update properties
::{
    NewField: "value",
    ComputedField: _::Out<Follows>::COUNT
}

Get all properties except for the id and the name
::!{
    id, name
}
    Defines **usr** as a variable that can me used inside the mapping
::|usr|{
            following: usr::In<Follows>,
            posts: posts::{
                postID: ID,
                creatorID: usr::ID,
                .. // this is the spread operator (ONLY TWO DOTS) to include everything else as is
            },
        }

        Get the first 10 users
users <- N<User>::RANGE(0, 10)

Get 10 users starting from the 10th user
users <- N<User>::RANGE(10, 20)

::WHERE(condition)	Filter elements that satisfy the condition
QUERY GetAdultUsers {
    // Get all users
    all_users <- N<User>
    // Filter to only users over 18
    adult_users <- all_users::WHERE(_::{age}::GT(18))
    // Filter to users with specific name pattern
    johns <- all_users::WHERE(_::{name}::EQ("John"))
    RETURN adult_users, johns
}
::GT(value)	Greater than	::WHERE(_::{age}::GT(25))
::LT(value)	Less than	::WHERE(_::{age}::LT(30))
::EQ(value)	Equals	::WHERE(_::{status}::EQ("active"))
::NEQ(value)	Not equals	::WHERE(_::{status}::NEQ("deleted"))
::GTE(value)	Greater than or equal	::WHERE(_::{rating}::GTE(4.5))
::LTE(value)	Less than or equal	::WHERE(_::{priority}::LTE(2))

EXISTS(traversal)	Returns true if the traversal returns any elements
Check if user has any followers
    has_followers <- EXISTS(user::In<Follows>)
::COUNT	Count the number of elements

Respond with ONLY the HelixQL query code, no explanations.`;

        const userPrompt = currentQuery 
            ? `Current query:\n${currentQuery}\n\nUser request: ${prompt}\n\nIf this is a question about the query, provide an explanation. If this is a request to modify or create a query, provide both a new query and a brief explanation of what changed or what the query does. Format your response as follows:\n\n<the query code here starting "QUERY <name> (<params>) =>>\n\nEXPLANATION:\n<1-2 sentences explaining the changes or answering the question>`
            : `Generate a query that does the following: ${prompt}\n\nFormat your response as follows:\n\n<the query code here starting "QUERY <name> (<params>) =>>\n\nEXPLANATION:\n<1-2 sentences explaining what the query does>`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        const response = completion.choices[0]?.message?.content;
        
        if (!response) {
            throw new Error('No response generated');
        }
        console.log("FOO",response);
        // Parse the response to separate query and explanation
        const queryMatch = response.match(/^(QUERY[\s\S]*?)(?=\n\nEXPLANATION:)/);
        const explanationMatch = response.match(/EXPLANATION:\n([\s\S]*?)$/);

        const query = queryMatch ? queryMatch[1].trim() : '';
        const explanation = explanationMatch ? explanationMatch[1].trim() : '';

        if (!query && !explanation) {
            throw new Error('Invalid response format');
        }

        return NextResponse.json({ query, explanation });
    } catch (error) {
        console.error('Error calling OpenAI:', error);
        return NextResponse.json(
            { error: 'Failed to generate query' },
            { status: 500 }
        );
    }
} 
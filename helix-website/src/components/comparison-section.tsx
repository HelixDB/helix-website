import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Brain, Shield, Zap } from "lucide-react";

const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            duration: 0.3
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

const comparisonExamples = {
    cypher: {
        name: "Cypher",
        code: `MATCH (user:User)
WHERE id(user) = $userID
MATCH (user)-[:Posts]->(posts)
WITH user, collect(posts)[..20] as posts
RETURN user.name as name,
       user.age as age,
       id(user) as id,
       [(follower)-[:Follows]->(user) | follower] as following,
       [p IN posts | {
           postID: id(p),
           creatorID: id(user),
           title: p.title,
           createdAt: p.createdAt,
           content: p.content
       }] as posts`,
        lines: 6
    },
    gremlin: {
        name: "Gremlin",
        code: `g.V(userID)
  .as('user')
  .out('posts')
  .limit(20)
  .as('posts')
  .select('user')
  .project('name', 'age', 'id', 'following', 'posts')
  .by('name')
  .by('age')
  .by('id')
  .by(__.in('Follows'))
  .by(__.out('Posts').limit(20)
    .project('postID', 'creatorID', 'title', 'createdAt', 'content')
    .by('id')
    .by(__.select('user').id())
    .by('title')
    .by('createdAt')
    .by('content')
)`,
        lines: 5
    }
};

export function ComparisonSection() {
    const [selectedLanguage, setSelectedLanguage] = useState<'cypher' | 'gremlin'>('cypher');

    return (
        <motion.div
            variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
            }}
            className="py-20 relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background/50 " />
            <div className="absolute inset-0 bg-grid-white/[0.01] bg-grid-primary/[0.01]" />
            <div className="container relative mx-auto px-4">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={titleVariants}
                    className="text-center mb-16 max-w-7xl mx-auto"
                >
                    <div className="relative inline-block">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent [text-wrap:balance] bg-gradient-to-br from-foreground via-foreground/90 to-primary/80">
                            Simple, Powerful, and Intuitive
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            See how HelixQL simplifies complex queries compared to traditional query languages
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-7xl mx-auto"
                >
                    {/* Combined card for mobile, split on desktop */}
                    <motion.div
                        variants={itemVariants}
                        className="md:hidden p-6 rounded-xl border border-white/10 bg-muted/30 backdrop-blur-xl shadow-xl"
                    >
                        <div className="flex flex-col gap-6">
                            {/* HelixQL section */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-foreground">HelixQL</h3>
                                </div>
                                <pre className="bg-background/80 p-4 rounded-md overflow-x-auto border border-white/10">
                                    <code className="text-sm">
                                        {`QUERY findFriends(userID: String) =>
  user <- V<User>(userID)
  posts <- user::Out<Posts>::RANGE(20)
  RETURN user::|usr|{
            ID, name, age, 
            following: usr::In<Follows>,
            posts: posts::{
                postID: ID,
                creatorID: usr::ID,
                ..
            },
        }`}
                                    </code>
                                </pre>
                            </div>

                            {/* Comparison section */}
                            <div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <Button
                                                variant={selectedLanguage === 'cypher' ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setSelectedLanguage('cypher')}
                                                className="text-sm"
                                            >
                                                Cypher
                                            </Button>
                                            <Button
                                                variant={selectedLanguage === 'gremlin' ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setSelectedLanguage('gremlin')}
                                                className="text-sm"
                                            >
                                                Gremlin
                                            </Button>
                                        </div>
                                    </div>
                                    <pre className="bg-background/80 p-4 rounded-md overflow-x-auto border border-white/10">
                                        <code className="text-sm">
                                            {comparisonExamples[selectedLanguage].code}
                                        </code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Desktop layout */}
                    <motion.div
                        variants={itemVariants}
                        className="hidden md:block p-6 rounded-xl border border-white/10 bg-muted/30 backdrop-blur-xl shadow-xl"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-foreground">HelixQL</h3>
                        </div>
                        <pre className="bg-background/80 p-4 rounded-md overflow-x-auto border border-white/10">
                            <code className="text-sm">
                                {`QUERY findFriends(userID: String) =>
  user <- V<User>(userID)
  posts <- user::Out<Posts>::RANGE(20)
  RETURN user::|usr|{
            ID, name, age, 
            following: usr::In<Follows>,
            posts: posts::{
                postID: ID,
                creatorID: usr::ID,
                ..
            },
        }`}
                            </code>
                        </pre>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="hidden md:block p-6 rounded-xl border border-white/10 bg-muted/30 backdrop-blur-xl shadow-xl"
                    >
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    <Button
                                        variant={selectedLanguage === 'cypher' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setSelectedLanguage('cypher')}
                                        className="text-sm"
                                    >
                                        Cypher
                                    </Button>
                                    <Button
                                        variant={selectedLanguage === 'gremlin' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setSelectedLanguage('gremlin')}
                                        className="text-sm"
                                    >
                                        Gremlin
                                    </Button>
                                </div>
                            </div>
                            <pre className="bg-background/80 p-4 rounded-md overflow-x-auto border border-white/10">
                                <code className="text-sm">
                                    {comparisonExamples[selectedLanguage].code}
                                </code>
                            </pre>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
                >
                    <motion.div
                        variants={itemVariants}
                        className="p-6 rounded-xl border border-white/5 bg-muted/10 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                            }}
                            className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 relative"
                            style={{
                                background: `linear-gradient(135deg, 
                                    rgba(99, 102, 241, 0.1) 0%,
                                    rgba(139, 92, 246, 0.1) 100%)`
                            }}
                        >
                            <Zap className="w-7 h-7 text-primary" />
                        </motion.div>
                        <h3 className="text-xl font-semibold mb-2 text-foreground">70% Less Code</h3>
                        <p className="text-muted-foreground">Write cleaner, more maintainable queries with our intuitive syntax</p>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="p-6 rounded-xl border border-white/5 bg-muted/10 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                            }}
                            className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 relative"
                            style={{
                                background: `linear-gradient(135deg, 
                                    rgba(99, 102, 241, 0.1) 0%,
                                    rgba(139, 92, 246, 0.1) 100%)`
                            }}
                        >
                            <Shield className="w-7 h-7 text-primary" />
                        </motion.div>
                        <h3 className="text-xl font-semibold mb-2 text-foreground">Type Safety</h3>
                        <p className="text-muted-foreground">Catch errors at compile time with full type checking and IDE support</p>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="p-6 rounded-xl border border-white/5 bg-muted/10 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                            }}
                            className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 relative"
                            style={{
                                background: `linear-gradient(135deg, 
                                    rgba(99, 102, 241, 0.1) 0%,
                                    rgba(139, 92, 246, 0.1) 100%)`
                            }}
                        >
                            <Brain className="w-7 h-7 text-primary" />
                        </motion.div>
                        <h3 className="text-xl font-semibold mb-2 text-foreground">Native Vector Support</h3>
                        <p className="text-muted-foreground">Seamlessly combine graph traversals with vector operations</p>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
} 
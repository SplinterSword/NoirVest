from google.adk.agents import SequentialAgent, Agent
from investment_agent.helper_tool import get_stock_sentiment, get_market_data_for_assets
from investment_agent.instructions import (
    planner_agent_instruction,
    asset_selector_agent_instruction,
    market_analyzer_agent_instruction,
    portfolio_recommender_agent_instruction,
    explainer_agent_instruction,
    graph_generator_agent_instruction,
    complier_agent_instruction
)       

planner_agent = Agent(
    name="PlannerAgent",
    model="gemini-2.0-flash",
    instruction=planner_agent_instruction,
    description=(
        "Planner agent that plans the investment strategy for the user."
    ),
    output_key="planner_agent_output"
)

asset_selector_agent = Agent(
    name="AssetSelectorAgent",
    model="gemini-2.0-flash",
    instruction=asset_selector_agent_instruction,
    description=(
        "Asset selector agent that selects the assets for the user."
    ),
    tools=[get_stock_sentiment],
    output_key="asset_selector_agent_output"
)

market_analyzer_agent = Agent(
    name="MarketAnalyzerAgent",
    model="gemini-2.0-flash",
    instruction=market_analyzer_agent_instruction,
    description=(
        "Market analyzer agent that analyzes the market and provides insights to the user."
    ),
    tools=[get_market_data_for_assets],
    output_key="market_analyzer_agent_output"
)

portfolio_recommender_agent = Agent(
    name="PortfolioRecommenderAgent",
    model="gemini-2.0-flash",
    instruction=portfolio_recommender_agent_instruction,
    description=(
        "Portfolio recommender agent that recommends the best portfolio for the user."
    ),
    output_key="portfolio_recommender_agent_output"
)

explainer_agent = Agent(
    name="ExplainerAgent",
    model="gemini-2.0-flash",
    instruction=explainer_agent_instruction,
    description=(
        "Explainer agent that explains the investment strategy to the user."
    ),
    output_key="explainer_agent_output" 
)

graph_generator_agent = Agent(
    name="GraphGeneratorAgent",
    model="gemini-2.0-flash",
    instruction=graph_generator_agent_instruction,
    description=(
        "Graph generator agent that generates visualizations for the investment strategy. "
    ),
    output_key="graph_generator_agent_output"
)

complier_agent = Agent(
    name="ComplierAgent",
    model="gemini-2.0-flash",
    instruction=complier_agent_instruction,
    description=(
        "Complier agent that ensures the investment strategy complies with the correct json structure for the frontend."
    ),
    output_key="complier_agent_output"
)

investment_pipeline_agent = SequentialAgent(
    name="InvestmentPipelineAgent",
    sub_agents=[planner_agent, asset_selector_agent, market_analyzer_agent, portfolio_recommender_agent, explainer_agent, graph_generator_agent, complier_agent],
    description=(
        "Executes a sequence of investment processes, to generate the best investment strategy for the user with the given requirements."
    )
)

root_agent = investment_pipeline_agent
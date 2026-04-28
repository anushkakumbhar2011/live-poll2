#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Env};

const OPTION_KEY: soroban_sdk::Symbol = symbol_short!("opt");

#[contract]
pub struct PollContract;

#[contractimpl]
impl PollContract {
    /// Vote for an option (0 or 1)
    /// Increments the vote count for the specified option
    pub fn vote(env: Env, option: u32) -> u32 {
        // Validate option is 0 or 1
        if option > 1 {
            panic!("Invalid option. Must be 0 or 1");
        }

        // Create storage key for this option
        let key = (OPTION_KEY, option);
        
        // Get current vote count (default to 0 if not exists)
        let current_votes: u32 = env.storage().instance().get(&key).unwrap_or(0);
        
        // Increment vote count
        let new_votes = current_votes + 1;
        
        // Store updated count
        env.storage().instance().set(&key, &new_votes);
        
        // Return new vote count
        new_votes
    }

    /// Get vote count for an option (0 or 1)
    /// Returns 0 if option has no votes yet
    pub fn get_votes(env: Env, option: u32) -> u32 {
        // Validate option is 0 or 1
        if option > 1 {
            panic!("Invalid option. Must be 0 or 1");
        }

        // Create storage key for this option
        let key = (OPTION_KEY, option);
        
        // Get vote count (default to 0 if not exists)
        env.storage().instance().get(&key).unwrap_or(0)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::Env;

    #[test]
    fn test_vote_option_0() {
        let env = Env::default();
        let contract_id = env.register_contract(None, PollContract);
        let client = PollContractClient::new(&env, &contract_id);

        // First vote for option 0
        let votes = client.vote(&0);
        assert_eq!(votes, 1);

        // Second vote for option 0
        let votes = client.vote(&0);
        assert_eq!(votes, 2);

        // Get votes for option 0
        let votes = client.get_votes(&0);
        assert_eq!(votes, 2);
    }

    #[test]
    fn test_vote_option_1() {
        let env = Env::default();
        let contract_id = env.register_contract(None, PollContract);
        let client = PollContractClient::new(&env, &contract_id);

        // Vote for option 1
        let votes = client.vote(&1);
        assert_eq!(votes, 1);

        // Get votes for option 1
        let votes = client.get_votes(&1);
        assert_eq!(votes, 1);
    }

    #[test]
    fn test_multiple_options() {
        let env = Env::default();
        let contract_id = env.register_contract(None, PollContract);
        let client = PollContractClient::new(&env, &contract_id);

        // Vote for option 0 twice
        client.vote(&0);
        client.vote(&0);

        // Vote for option 1 three times
        client.vote(&1);
        client.vote(&1);
        client.vote(&1);

        // Check vote counts
        assert_eq!(client.get_votes(&0), 2);
        assert_eq!(client.get_votes(&1), 3);
    }

    #[test]
    fn test_get_votes_no_votes() {
        let env = Env::default();
        let contract_id = env.register_contract(None, PollContract);
        let client = PollContractClient::new(&env, &contract_id);

        // Get votes for option that hasn't been voted on
        let votes = client.get_votes(&0);
        assert_eq!(votes, 0);
    }

    #[test]
    #[should_panic(expected = "Invalid option")]
    fn test_vote_invalid_option() {
        let env = Env::default();
        let contract_id = env.register_contract(None, PollContract);
        let client = PollContractClient::new(&env, &contract_id);

        // Try to vote for invalid option
        client.vote(&2);
    }

    #[test]
    #[should_panic(expected = "Invalid option")]
    fn test_get_votes_invalid_option() {
        let env = Env::default();
        let contract_id = env.register_contract(None, PollContract);
        let client = PollContractClient::new(&env, &contract_id);

        // Try to get votes for invalid option
        client.get_votes(&2);
    }
}

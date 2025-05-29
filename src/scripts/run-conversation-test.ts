import { testConversation } from './test-conversation';

console.log('🤖 Starting Conversation Mode Test...\n');

testConversation()
  .then(() => {
    console.log('\n🎉 All tests completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });

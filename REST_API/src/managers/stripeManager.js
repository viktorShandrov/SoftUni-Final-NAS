
const filesManager = require("./filesManager")






exports.paymentIsSuccessful = async(user)=>{
            const root = await filesManager.getOnlyRootInfo(user.rootId)
            if(root.paidFileContainer){
                await filesManager.unlockPaidContainer(root.paidFileContainer)
                await filesManager.addToRootTotalVolume(100000000000,root)
            }else{
                const paidFileContainer = await filesManager.createFileContainer("paid",user._id,user.rootId,100)
                root.paidFileContainer = paidFileContainer._id
                await filesManager.addToRootTotalVolume(100000000000,root)
            }
            return root.save()

}
exports.paymentIsUnsuccessful = async(user)=>{
            const root = await filesManager.getOnlyRootInfo(user.rootId)
            await filesManager.lockPaidContainer(root.paidFileContainer)
            await filesManager.removeFromRootTotalVolume(100000000000,root)
            return  root.save()
}
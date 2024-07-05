/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 07-05-2024
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [SELECT Id, Name, Phone, Website, Owner.Name,AnnualRevenue FROM Account WHERE Industry = 'Financial Services'];
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountswithSearch(String searchKey) {
        String key = '%' + searchKey + '%';
        return [SELECT Id, Name, Phone, Website, Owner.Name,AnnualRevenue FROM Account WHERE Industry = 'Financial Services' AND Name LIKE :key  LIMIT 100];
    }
    
}
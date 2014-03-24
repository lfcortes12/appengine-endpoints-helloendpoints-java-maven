package com.google.devrel.samples.helloendpoints;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Named;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.devrel.samples.helloendpoints.entities.User;
import com.google.devrel.samples.helloendpoints.persistence.PMF;

/**
 * Defines v1 of a helloworld API, which provides simple "greeting" methods.
 */
@Api(
    name = "helloworld",
    version = "v1",
    scopes = {Constants.EMAIL_SCOPE},
    clientIds = {Constants.WEB_CLIENT_ID, Constants.ANDROID_CLIENT_ID, Constants.IOS_CLIENT_ID},
    audiences = {Constants.ANDROID_AUDIENCE}
)
public class Greetings {

  public static ArrayList<HelloGreeting> greetings = new ArrayList<HelloGreeting>();

  static {
    greetings.add(new HelloGreeting("hello world!"));
    greetings.add(new HelloGreeting("goodbye world!"));
  }

  public HelloGreeting getGreeting(@Named("id") Integer id) {
    return greetings.get(id);
  }

  public ArrayList<HelloGreeting> listGreeting() {
    return greetings;
  }
  
  @ApiMethod(name = "ensename.getEmail", path = "hellogreeting/getEmail")
  public HelloGreeting getUserName(@Named("email") String email, @Named("password") String password) {
	  HelloGreeting response = new HelloGreeting("My email is " + email + " and my password is " + password);
	  return response;
  }
  
  @ApiMethod(name = "ensename.user.create", path = "hellogreeting/user/create", httpMethod = "post")
  public com.google.devrel.samples.helloendpoints.entities.User createUser(com.google.devrel.samples.helloendpoints.entities.User user) {
	  PersistenceManager pm = getPersistenceManager();
	  user.setId(user.getEmail().trim().toLowerCase());
      pm.makePersistent(user);
      pm.close();
      return user;
  }
  
	@ApiMethod(name = "ensename.user.remove", path = "hellogreeting/user/remove", httpMethod = "post")
	public com.google.devrel.samples.helloendpoints.entities.User removeUser(
			@Named("id") String id) {
		PersistenceManager pm = getPersistenceManager();
		User user = null;
		try {
			user = pm.getObjectById(User.class, id);
			pm.deletePersistent(user);
		} finally {
			pm.close();
		}
		return user;
	}
  
  @SuppressWarnings("unchecked")
  @ApiMethod(name = "ensename.user.list", path = "hellogreeting/user/list", httpMethod = "get")
  public List<com.google.devrel.samples.helloendpoints.entities.User> listUsers() {
	  PersistenceManager pm = getPersistenceManager();
	  Query query = pm.newQuery(com.google.devrel.samples.helloendpoints.entities.User.class);
      List<com.google.devrel.samples.helloendpoints.entities.User> results = (List<com.google.devrel.samples.helloendpoints.entities.User>) pm.newQuery(query).execute();
	  return results;
  }
  
  private static synchronized PersistenceManager getPersistenceManager() {
    return PMF.get().getPersistenceManager();
  }
}

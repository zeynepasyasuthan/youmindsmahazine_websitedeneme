rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // DENY BY DEFAULT
    match /{document=**} {
      allow read, write: if false;
    }

    // AUTH HELPERS
    function isSignedIn() { return request.auth != null; }
    function isOwner(userId) { return isSignedIn() && request.auth.uid == userId; }
    function isValidId(id) { return id is string && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$'); }
    function isAdmin() { return isSignedIn() && exists(/databases/$(database)/documents/admins/$(request.auth.uid)); }
    function incoming() { return request.resource.data; }
    function existing() { return resource.data; }

    // MAGAZINES
    match /magazines/{magazineId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // BLOGS
    match /blogs/{blogId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // REVIEWS
    match /reviews/{reviewId} {
      function isValidReview(data) {
        return data.magazineId is string && data.magazineId.size() <= 128 &&
               data.userId == request.auth.uid &&
               data.userName is string && data.userName.size() <= 100 &&
               data.comment is string && data.comment.size() <= 1000 &&
               data.approved == false &&
               data.createdAt == request.time;
      }
      
      allow read: if existing().approved == true || isAdmin() || isOwner(existing().userId);
      allow create: if isSignedIn() && isValidReview(incoming());
      allow update: if isAdmin();
      allow delete: if isAdmin() || isOwner(existing().userId);
    }

    // USERS
    match /users/{userId} {
      function isValidUser(data) {
        return data.uid == request.auth.uid &&
               data.email is string &&
               data.library is list &&
               data.totalDonations is number;
      }
      allow read: if isOwner(userId) || isAdmin();
      allow create, update: if isOwner(userId) && isValidUser(incoming());
    }

    // DONATIONS
    match /donations/{donationId} {
      allow read: if isAdmin() || isOwner(existing().userId);
      allow create: if isSignedIn() && incoming().userId == request.auth.uid;
    }

    // ADMINS
    match /admins/{adminId} {
      allow read: if isSignedIn() && request.auth.uid == adminId;
      allow write: if false; // Only manageable via console
    }
  }
}

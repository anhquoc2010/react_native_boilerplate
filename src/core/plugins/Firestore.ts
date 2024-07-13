import _ from 'lodash';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

type TCollection = 'NotificationTokens';

class CFirestore {
  private static _instance: CFirestore;

  private constructor() {
    // ...
  }

  public static get Instance(): CFirestore {
    /* istanbul ignore else */
    if (!this._instance) {
      this._instance = new this();
    }
    return CFirestore._instance;
  }

  getCollection = (name: TCollection) => firestore().collection(name);

  get = async (name: TCollection, condition?: any[]) => {
    if (condition) {
      return firestore().collection(name).where(condition[0], condition[1], condition[2]).get();
    }
    return firestore().collection(name).get();
  };

  find = async (name: TCollection, id: string) => firestore().collection(name).doc(id).get();

  add = async (collection: TCollection, data: any) => {
    if (!_.isUndefined(data.id)) {
      return firestore().collection(collection).doc(data.id.toString()).set(_.omit(data, 'id'));
    }
    return firestore().collection(collection).add(_.omit(data, 'id'));
  };

  update = async (collection: TCollection, id: string, data: any) =>
    firestore().collection(collection).doc(id).update(data);

  delete = async (collection: TCollection, id: string) =>
    firestore().collection(collection).doc(id).delete();

  listen = (
    collection: TCollection,
    condition: any[],
    fn: (change: FirebaseFirestoreTypes.DocumentChange<FirebaseFirestoreTypes.DocumentData>) => any,
  ) => {
    firestore()
      .collection(collection)
      .where(condition[0], condition[1], condition[2])
      .onSnapshot({ includeMetadataChanges: true }, snapshot => {
        snapshot.docChanges().forEach(change => {
          fn(change);
          // if (change.type === 'added') {
          //   // eslint-disable-next-line no-console
          //   console.log('New city: ', change.doc.data());
          // }

          const source = snapshot.metadata.fromCache ? 'local cache' : 'server';
          // eslint-disable-next-line no-console
          console.log(`Data came from ${source}`);
        });
      });
  };
}

const Firestore = CFirestore.Instance;
export default Firestore;
